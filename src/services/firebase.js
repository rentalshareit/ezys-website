import firebaseRoot from "firebase";
import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { containsThreeConsecutiveOrderedChars } from "@/helpers/utils";
import firebaseConfig from "./config";

class Firebase {
  constructor() {
    app.initializeApp(firebaseConfig);

    this.storage = app.storage();
    this.db = app.firestore();
    this.auth = app.auth();
  }

  // AUTH ACTIONS ------------
  captchaVerify = async () => {
    let recaptchaContainer = document.getElementById("recaptcha-container");

    // Remove the existing recaptcha-container if it exists
    if (recaptchaContainer) {
      recaptchaContainer.remove();
    }

    // Recreate the recaptcha-container element
    recaptchaContainer = document.createElement("div");
    recaptchaContainer.id = "recaptcha-container";
    recaptchaContainer.style.display = "none";
    document.body.appendChild(recaptchaContainer);

    // Clear the existing reCAPTCHA instance if it exists
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.warn("Failed to clear reCAPTCHA verifier:", error.message);
      }
      window.recaptchaVerifier = null;
    }

    // Create a new reCAPTCHA instance
    return new Promise((resolve) => {
      window.recaptchaVerifier = new firebaseRoot.auth.RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved");
            resolve(window.recaptchaVerifier);
          },
          "expired-callback": () => {
            console.error("Captcha expired. Please try again.");
            window.recaptchaVerifier.clear();
          },
        }
      );
      window.recaptchaVerifier.verify();
    });
  };

  sendOTP = async (phoneNumber) => {
    try {
      const appVerifier = await this.captchaVerify();
      const confirmationResult = await this.auth.signInWithPhoneNumber(
        phoneNumber,
        appVerifier
      );
      window.confirmationResult = confirmationResult;
    } catch (error) {
      console.error("Failed to send OTP:", error.message);
      throw new Error(
        "Failed to send OTP. Please check the phone number and try again."
      );
    }
  };

  verifyOTP = async (otp) => {
    try {
      return await window.confirmationResult.confirm(otp);
    } catch (error) {
      console.error("Invalid OTP:", error.message);
      window.confirmationResult = null;
      throw new Error("Invalid OTP. Please try again.");
    }
  };

  signOut = () => this.auth.signOut();

  addUser = (id, user) => this.db.collection("users").doc(id).set(user);

  getUser = (id) => this.db.collection("users").doc(id).get();

  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = app.auth.EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    return user.reauthenticateWithCredential(cred);
  };

  updateProfile = (id, updates) =>
    this.db.collection("users").doc(id).update(updates);

  onAuthStateChanged = () =>
    new Promise((resolve, reject) => {
      this.auth.onAuthStateChanged((user) => {
        if (user) {
          resolve(user);
        } else {
          reject(new Error("Auth State Changed failed"));
        }
      });
    });

  saveBasketItems = (items, userId) =>
    this.db.collection("users").doc(userId).update({ basket: items });

  setAuthPersistence = () =>
    this.auth.setPersistence(app.auth.Auth.Persistence.LOCAL);

  // MIGRATION-SAFE PRODUCT ACTIONS --------------

  // ✅ MAGIC: Works with old IDs AND new slugs
  getSingleProduct = async (idOrSlug) => {
    try {
      // 1. Try direct document lookup first (old numeric IDs & new slugs)
      let docSnap = await this.db.collection("products").doc(idOrSlug).get();

      // 2. If not found, try originalId field lookup
      if (!docSnap.exists) {
        const q = this.db
          .collection("products")
          .where("originalId", "==", idOrSlug);
        const querySnap = await q.get();
        if (!querySnap.empty) {
          docSnap = querySnap.docs[0];
        }
      }

      return docSnap;
    } catch (error) {
      console.error("Error fetching product:", error);
      throw error;
    }
  };

  getProducts = () => {
    let didTimeout = false;

    return new Promise((resolve, reject) => {
      (async () => {
        const timeout = setTimeout(() => {
          didTimeout = true;
          reject(new Error("Request timeout, please try again"));
        }, 15000);

        try {
          const totalQuery = await this.db.collection("products").get();
          const total = totalQuery.docs.length;
          const query = this.db
            .collection("products")
            .orderBy(app.firestore.FieldPath.documentId())
            .limit(total);
          const snapshot = await query.get();

          clearTimeout(timeout);
          if (!didTimeout) {
            const products = [];
            snapshot.forEach((doc) => {
              const data = doc.data();
              // ✅ BACKWARD COMPATIBLE: Return originalId as 'id'
              products.push({
                id: data.originalId || doc.id,
                ...data,
              });
            });
            resolve(products);
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e?.message || "Failed to fetch products.");
        }
      })();
    });
  };

  // ✅ Collection group search by original ID (for subcollections)
  getProductsByOriginalId = (originalId) => {
    return this.db
      .collectionGroup("products")
      .where("originalId", "==", originalId)
      .get();
  };

  searchProducts = (searchKey) => {
    let didTimeout = false;

    if (!searchKey || searchKey.length < 3)
      return Promise.resolve({ products: [] });

    return new Promise((resolve, reject) => {
      (async () => {
        const products = await this.getProducts(); // Already migration-safe

        const timeout = setTimeout(() => {
          didTimeout = true;
          reject(new Error("Request timeout, please try again"));
        }, 15000);

        const searchKeys = searchKey
          .split(" ")
          .map((s) => s.trim().toLowerCase());

        try {
          const searchResults = products.filter((p) =>
            searchKeys.some((s) => {
              const doesNameMatch = containsThreeConsecutiveOrderedChars(
                p.name_lower,
                s
              );
              if (doesNameMatch) return true;
              return p.keywords.some((k) =>
                containsThreeConsecutiveOrderedChars(k, s)
              );
            })
          );

          clearTimeout(timeout);
          if (!didTimeout) {
            resolve({ products: searchResults });
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e);
        }
      })();
    });
  };

  // ✅ Migration-safe: Auto-generates slugs + stores originalId
  addProduct = async (id, product) => {
    try {
      // Generate slug if no ID provided
      if (!id) {
        id = this.generateSlug(product.name);
      }

      // Always store both IDs for compatibility
      const productWithIds = {
        ...product,
        originalId: id,
        slug: id,
        createdAt: app.firestore.FieldValue.serverTimestamp(),
      };

      return await this.db.collection("products").doc(id).set(productWithIds);
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  };

  // ✅ Works with original ID (finds via getSingleProduct)
  editProduct = async (idOrSlug, updates) => {
    try {
      const productSnap = await this.getSingleProduct(idOrSlug);

      if (!productSnap.exists) {
        throw new Error("Product not found");
      }

      const productRef = productSnap.ref;
      return await productRef.update(updates);
    } catch (error) {
      console.error("Error editing product:", error);
      throw error;
    }
  };

  // ✅ Works with original ID (finds via getSingleProduct)
  removeProduct = async (idOrSlug) => {
    try {
      const productSnap = await this.getSingleProduct(idOrSlug);

      if (!productSnap.exists) {
        throw new Error("Product not found");
      }

      const productRef = productSnap.ref;
      return await productRef.delete();
    } catch (error) {
      console.error("Error removing product:", error);
      throw error;
    }
  };

  generateKey = () => this.db.collection("products").doc().id;

  // STORAGE METHODS (UNCHANGED - use originalId)
  storeImage = async (id, folder, imageFile) => {
    const snapshot = await this.storage.ref(folder).child(id).put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();
    return downloadURL;
  };

  getImage = async (id, folder = "products") => {
    try {
      const downloadURL = await this.storage
        .ref(folder)
        .child(id)
        .getDownloadURL();
      return downloadURL;
    } catch (error) {
      throw new Error("Failed to get download URL: " + error.message);
    }
  };

  deleteImage = (id, folder = "products") =>
    this.storage.ref(folder).child(id).delete();

  uploadBase64Image = async (idPrefix, folder, dataUrl) => {
    const id = [idPrefix, Date.now()].join("_");
    const storageRef = this.storage.ref(folder).child(id);
    await storageRef.putString(
      dataUrl.replace("data:image/jpeg;base64,", ""),
      "base64"
    );
    const url = await storageRef.getDownloadURL();
    return url;
  };

  deleteFolder = async (folder) => {
    const folderRef = this.storage.ref(folder);
    const listResult = await folderRef.listAll();

    const deletePromises = listResult.items.map((item) => item.delete());
    await Promise.all(deletePromises);

    const subfolderPromises = listResult.prefixes.map((subfolder) =>
      this.deleteFolder(subfolder.fullPath)
    );
    await Promise.all(subfolderPromises);
  };

  uploadFiles = async (files, folder, idPrefix) => {
    await this.deleteFolder(folder);
    const uploadPromises = files.map(async (file, index) => {
      const id = [idPrefix, Date.now(), index].join("_");
      const storageRef = this.storage.ref(folder).child(id);
      await storageRef.put(file);
      const url = await storageRef.getDownloadURL();
      return url;
    });

    return Promise.all(uploadPromises);
  };

  // NEW: Slug generator for URL-friendly IDs
  generateSlug = (name) => {
    if (!name) return this.db.collection("products").doc().id;

    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special chars
      .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with -
      .replace(/^-+|-+$/g, "") // Remove leading/trailing -
      .substring(0, 100); // Limit length
  };
}

const firebaseInstance = new Firebase();

export default firebaseInstance;
