/* eslint-disable jsx-a11y/label-has-associated-control */
import { CheckOutlined, LoadingOutlined } from "@ant-design/icons";
import { ImageLoader } from "@/components/common";
import {
  CustomSelect,
  CustomInput,
  CustomTextarea,
  CustomCreatableSelect,
} from "@/components/formik";
import { Field, FieldArray, Form, Formik } from "formik";
import { useFileHandler } from "@/hooks";
import PropType from "prop-types";
import React from "react";
import * as Yup from "yup";

// Possible Tag Names
const tagOptions = [
  { value: "ps4slim", label: "PS4 Slim" },
  { value: "ps4pro", label: "PS4 Pro" },
  { value: "ps5digital", label: "PS5 Digital" },
  { value: "metaquest3s", label: "Meta Quest 3S" },
  { value: "ac", label: "Assassins Creed" },
  { value: "cod", label: "Call Of Duty" },
  { value: "fc24", label: "FIFA 24" },
  { value: "fc25", label: "FIFA 25" },
  { value: "gt", label: "Gran Tursimo" },
  { value: "hz", label: "Horizon Zero Dawn" },
  { value: "nfs", label: "Need for Speed" },
  { value: "sp", label: "Spiderman" },
  { value: "wwe", label: "WWE 2K18" },
  { value: "t", label: "Tekken 7" },
  { value: "gta5", label: "GTA 5" },
  { value: "gta5digital", label: "GTA 5 Digital" },
  { value: "screen", label: "Screen" },
  { value: "projector", label: "Projector" },
  { value: "mea", label: "Mass Effect Andromeda" },
  { value: "bf2", label: "Battlefront II" },
  { value: "bm", label: "Batman Arkham Knight" },
  { value: "fcnd", label: "Far Cry New Dawn" },
  { value: "mkxl", label: "Mortal Kombat XL" },
  { value: "rdr2", label: "Red Dead Redemption 2" },
  { value: "w3wh", label: "Witcher 3" },
  { value: "eaplay", label: "EA Play Subscription" },
];

// Default brand names that I used. You can use what you want
const brandOptions = [
  { value: "sony", label: "Sony" },
  { value: "microsoft", label: "Microsoft" },
  { value: "meta", label: "Meta" },
  { value: "other", label: "Other" },
];

const subscriptionTypeOptions = [
  { value: "psn_deluxe", label: "PSN Deluxe Subscription" },
  { value: "meta_plus", label: "Meta Plus Subscription" },
  { value: "ea_play", label: "EA Play Subscription" },
];

const categoryOptions = [
  { value: "Gaming Consoles", label: "Gaming Consoles" },
  { value: "Virtual Reality", label: "Virtual Reality" },
  { value: "Games & Controllers", label: "Games & Controllers" },
  { value: "Projectors & Screen", label: "Projectors & Screen" },
];

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .required("Product name is required.")
    .max(60, "Product name must only be less than 60 characters."),
  brand: Yup.string().required("Brand name is required."),
  category: Yup.string().required("Category is required."),
  price: Yup.string().required(),
  description: Yup.string().required("Description is required."),
  maxQuantity: Yup.number()
    .positive("Max quantity is invalid.")
    .integer("Max quantity should be an integer.")
    .required("Max quantity is required."),
  keywords: Yup.array()
    .of(Yup.string())
    .min(1, "Please enter at least 1 keyword for this product."),
  setup: Yup.string(),
  included: Yup.string(),
  configuration: Yup.string(),
  features: Yup.string(),
  subscription: Yup.boolean(),
  subscription_type: Yup.string().when("subscription", {
    is: true,
    then: Yup.string().required(
      "Subscription type is required when subscription is enabled"
    ),
    otherwise: Yup.string().nullable(),
  }),
  tags: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least 1 tag for this product."),
});

const ProductForm = ({ product, onSubmit, isLoading }) => {
  const initFormikValues = {
    name: product?.name || "",
    brand: product?.brand || "",
    category: product?.category || "",
    price: product?.price || "",
    maxQuantity: product?.maxQuantity || 0,
    description: product?.description || "",
    keywords: product?.keywords || [],
    setup: product?.setup || "",
    included: product?.included || "",
    configuration: product?.configuration || "",
    features: product?.features || "",
    tags: product?.tags || [],
    discount: product?.discount || 0,
    subscription: product?.subscription || false,
    subscription_type: product?.subscription_type || "",
  };

  const { imageFile, isFileLoading, onFileChange, removeImage } =
    useFileHandler({
      image: {},
      imageCollection: product?.imageCollection || [],
    });

  const onSubmitForm = (form) => {
    if (imageFile.image.file || product.image) {
      onSubmit({
        ...form,
        quantity: 1,
        // due to firebase function billing policy, let's add lowercase version
        // of name here instead in firebase functions
        name_lower: form.name.toLowerCase(),
        dateAdded: new Date().getTime(),
        image: imageFile?.image?.file || product.image,
        imageCollection: imageFile.imageCollection,
      });
    } else {
      // eslint-disable-next-line no-alert
      alert("Product thumbnail image is required.");
    }
  };

  return (
    <div>
      <Formik
        initialValues={initFormikValues}
        validateOnChange
        validationSchema={FormSchema}
        onSubmit={onSubmitForm}
      >
        {({ values, setValues }) => (
          <Form className="product-form">
            <div className="product-form-inputs">
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="name"
                    type="text"
                    label="* Product Name"
                    style={{ textTransform: "capitalize" }}
                    component={CustomInput}
                  />
                </div>
                &nbsp;
                <div className="product-form-field">
                  <CustomSelect
                    defaultValue={{ label: values.brand, value: values.brand }}
                    name="brand"
                    id="brand"
                    options={brandOptions}
                    disabled={isLoading}
                    placeholder="Select/Create Brand"
                    label="* Brand"
                  />
                </div>
              </div>
              <div className="product-form-field">
                <CustomSelect
                  defaultValue={{
                    label: values.category,
                    value: values.category,
                  }}
                  name="category"
                  id="category"
                  options={categoryOptions}
                  disabled={isLoading}
                  placeholder="Select/Create Category"
                  label="* Category"
                />
              </div>
              <div className="product-form-field">
                <CustomSelect
                  defaultValue={(values.tags || []).map((tag) => ({
                    value: tag,
                    label: tagOptions.find((t) => t.value === tag)?.label,
                  }))}
                  name="tags"
                  id="tags"
                  isMulti
                  options={tagOptions}
                  disabled={isLoading}
                  placeholder="Select Tags"
                  label="* Tags"
                />
              </div>
              <div className="product-form-field">
                <Field
                  disabled={isLoading}
                  name="description"
                  id="description"
                  rows={3}
                  label="* Product Description"
                  component={CustomTextarea}
                />
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="price"
                    id="price"
                    type="text"
                    label="* Price"
                    component={CustomInput}
                  />
                </div>
                &nbsp;
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="maxQuantity"
                    type="number"
                    id="maxQuantity"
                    label="* Max Quantity"
                    component={CustomInput}
                  />
                </div>
                <div className="product-form-field">
                  <Field
                    disabled={isLoading}
                    name="discount"
                    type="number"
                    id="discount"
                    label="Discount %"
                    component={CustomInput}
                  />
                </div>
              </div>
              <div className="product-form-field">
                <Field
                  disabled={isLoading}
                  name="setup"
                  type="text"
                  label="Set Up"
                  component={CustomInput}
                />
              </div>
              <div className="product-form-field">
                <Field
                  disabled={isLoading}
                  name="included"
                  type="text"
                  label="included"
                  component={CustomInput}
                />
              </div>
              <div className="product-form-field">
                <Field
                  disabled={isLoading}
                  name="configuration"
                  type="text"
                  label="configuration"
                  component={CustomInput}
                />
              </div>
              <div className="product-form-field">
                <Field
                  disabled={isLoading}
                  name="features"
                  type="text"
                  label="features"
                  component={CustomInput}
                />
              </div>
              <div className="d-flex">
                <div className="product-form-field">
                  <CustomCreatableSelect
                    defaultValue={values.keywords.map((key) => ({
                      value: key,
                      label: key,
                    }))}
                    name="keywords"
                    iid="keywords"
                    isMulti
                    disabled={isLoading}
                    placeholder="Create/Select Keywords"
                    label="* Keywords"
                  />
                </div>
                &nbsp;
              </div>
              <div className="product-form-field">
                <span className="d-block padding-s">Image Collection</span>
                {!isFileLoading && (
                  <label htmlFor="product-input-file-collection">
                    <input
                      disabled={isLoading}
                      hidden
                      id="product-input-file-collection"
                      multiple
                      onChange={(e) =>
                        onFileChange(e, {
                          name: "imageCollection",
                          type: "multiple",
                        })
                      }
                      readOnly={isLoading}
                      type="file"
                    />
                    Choose Images
                  </label>
                )}
              </div>
              <div className="product-form-collection">
                <>
                  {imageFile.imageCollection.length >= 1 &&
                    imageFile.imageCollection.map((image) => (
                      <div
                        className="product-form-collection-image"
                        key={image.id}
                      >
                        <ImageLoader alt="" src={image.url} />
                        <button
                          className="product-form-delete-image"
                          onClick={() =>
                            removeImage({
                              id: image.id,
                              name: "imageCollection",
                            })
                          }
                          title="Delete Image"
                          type="button"
                        >
                          <i className="fa fa-times-circle" />
                        </button>
                      </div>
                    ))}
                </>
              </div>
              <br />
              <div className="d-flex">
                <div className="product-form-field">
                  <input
                    checked={values.subscription}
                    className=""
                    id="subscsription"
                    onChange={(e) =>
                      setValues({ ...values, subscription: e.target.checked })
                    }
                    type="checkbox"
                  />
                  <label htmlFor="subscsription">
                    <h5 className="d-flex-grow-1 margin-0">
                      &nbsp; Includes Subscription &nbsp;
                    </h5>
                  </label>
                </div>
                {values.subscription && (
                  <div className="product-form-field">
                    <CustomSelect
                      name="subscription_type"
                      id="subscription_type"
                      defaultValue={subscriptionTypeOptions.find(
                        (option) =>
                          option.value === values.subscription_type ||
                          "psn_deluxe"
                      )}
                      options={subscriptionTypeOptions}
                      disabled={isLoading}
                      placeholder="Select Subscription Type"
                      label="* Subscription Type"
                    />
                  </div>
                )}
              </div>
              <br />
              <br />
              <br />
              <div className="product-form-field product-form-submit">
                <button className="button" disabled={isLoading} type="submit">
                  {isLoading ? <LoadingOutlined /> : <CheckOutlined />}
                  &nbsp;
                  {isLoading ? "Saving Product" : "Save Product"}
                </button>
              </div>
            </div>
            {/* ----THUBMNAIL ---- */}
            <div className="product-form-file">
              <div className="product-form-field">
                <span className="d-block padding-s">* Thumbnail</span>
                {!isFileLoading && (
                  <label htmlFor="product-input-file">
                    <input
                      disabled={isLoading}
                      hidden
                      id="product-input-file"
                      onChange={(e) =>
                        onFileChange(e, { name: "image", type: "single" })
                      }
                      readOnly={isLoading}
                      type="file"
                    />
                    Choose Image
                  </label>
                )}
              </div>
              <div className="product-form-image-wrapper">
                {(imageFile.image.url || product.image) && (
                  <ImageLoader
                    alt=""
                    className="product-form-image-preview"
                    src={imageFile.image.url || product.image}
                  />
                )}
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

ProductForm.propTypes = {
  product: PropType.shape({
    name: PropType.string,
    category: PropType.string,
    brand: PropType.string,
    price: PropType.number,
    maxQuantity: PropType.number,
    description: PropType.string,
    keywords: PropType.arrayOf(PropType.string),
    imageCollection: PropType.arrayOf(PropType.object),
    image: PropType.string,
    setup: PropType.string,
    included: PropType.string,
    configuration: PropType.string,
    features: PropType.string,
    subscription: PropType.bool,
    subscription_type: PropType.string,
  }).isRequired,
  onSubmit: PropType.func.isRequired,
  isLoading: PropType.bool.isRequired,
};

export default ProductForm;
