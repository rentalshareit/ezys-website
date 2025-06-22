import firebaseRoot from "firebase";
import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { hasTwoOrMoreCharsAsSubsequence } from "@/helpers/utils";
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
    if (!window.RecaptchaVerifier) {
      return new Promise((resolve) => {
        window.recaptchaVerifier = new firebaseRoot.auth.RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              resolve(window.recaptchaVerifier);
            },
          }
        );
        window.recaptchaVerifier.verify();
      });
    }
    return Promise.resolve(window.recaptchaVerifier);
  };

  sendOTP = async (phoneNumber) => {
    const appVerifier = await this.captchaVerify();
    const confirmationResult = await this.auth.signInWithPhoneNumber(
      phoneNumber,
      appVerifier
    );
    window.confirmationResult = confirmationResult;
  };

  verifyOTP = async (otp) => {
    return window.confirmationResult.confirm(otp);
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

  // // PRODUCT ACTIONS --------------

  getSingleProduct = (id) => this.db.collection("products").doc(id).get();

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
            snapshot.forEach((doc) =>
              products.push({ id: doc.id, ...doc.data() })
            );

            resolve(products);
          }
        } catch (e) {
          if (didTimeout) return;
          reject(e?.message || ":( Failed to fetch products.");
        }
      })();
    });
  };

  searchProducts = (searchKey) => {
    let didTimeout = false;

    if (!searchKey || searchKey.length < 3)
      return Promise.resolve({ products: [] });

    return new Promise((resolve, reject) => {
      (async () => {
        const products = await this.getProducts();

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
              const doesNameMatch = hasTwoOrMoreCharsAsSubsequence(
                p.name_lower,
                s
              );
              if (doesNameMatch) return true;
              return p.keywords.some((k) =>
                hasTwoOrMoreCharsAsSubsequence(k, s)
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

  getFeaturedProducts = () =>
    this.db.collection("products").where("isFeatured", "==", true).get();

  getRecommendedProducts = () =>
    this.db.collection("products").where("isRecommended", "==", true).get();

  addProduct = (id, product) =>
    this.db.collection("products").doc(id).set(product);

  generateKey = () => this.db.collection("products").doc().id;

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

  editProduct = (id, updates) =>
    this.db.collection("products").doc(id).update(updates);

  removeProduct = (id) => this.db.collection("products").doc(id).delete();
}

const firebaseInstance = new Firebase();

export default firebaseInstance;
