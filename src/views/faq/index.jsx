import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";

const data = {
  title: "Frequently Asked Questions",
  rows: [
    {
      title: "How can I rent from Ezys.",
      content: `Renting from Ezys is a seamless process. Just explore our diverse product range, pick your preferred dates, add items to your cart, and proceed to checkout
                                                                    OR
                You can connect to our Chat agents to place the order.`,
    },
    {
      title: "What is the minimum and maximum rental period.",
      content: "The rental period duration can be 1 day to 30 days.",
    },
    {
      title: "How is the rental calculated.",
      content: `Our rental rates are designed to be attractive for both short-term and long-term users.
      The longer you rent, the lower the effective per-day cost.`,
    },
    {
      title: "Can I pay upon delivery.",
      content: `Yes, pay on delivery is available for all orders`,
    },
    {
      title: "What are the payment options.",
      content: `You can make payments using UPI, credit/debit cards, net banking, and digital wallets. We don't accept cash payments.`,
    },
    {
      title: "How much time does it take to refund the deposit.",
      content:
        "In case of eligible refunds, we aim to process and credit the amount to the customer's bank account within 5-7 working days.",
    },
    {
      title:
        "When will I get the products and how the return time is calculated.",
      content: `The system processes the next day's orders based on stock availability. Your order will be delivered on your scheduled delivery date by 12 PM. The return time is calculated based on the delivery time, with a full 24-hour period considered as one rental day. For example, if you receive the product at 11:00 AM, the pickup will always be scheduled after that time on your return date unless a specific request is made by you.`,
    },
    {
      title: "Are there any cancellation charges",
      content: `If you cancel before the product is shipped, no charges will apply. However, if you cancel after the product has been shipped, shipping charges and rental fees for the applicable duration will be applied. For example, if you cancel after receiving the product, a one-day rental charge may be applied.`,
    },
    {
      title: "Are there any damage charges.",
      content: `Charges may apply for damages. Refer to our damage policy.`,
    },
    {
      title: "How do you calculate the damage charges.",
      content: "Refer to our damage policy.",
    },
    {
      title: "What about service and maintenance.",
      content: `Ezys provides service and maintenance support. If you experience any malfunctioning after product delivery, you can raise a ticket anytime at https://ezyshare.raiseaticket.com/support. Our team will assist you promptly.`,
    },
    {
      title:
        "What happens if any items don’t arrive as mentioned at the time of placing order.",
      content: `Notify us within 24 hours, and we'll address the issue promptly.`,
    },
    {
      title: "If my rental never arrives or arrives late, what should I do.",
      content: `Contact us immediately to report the issue, and we'll ensure prompt resolution.`,
    },
    {
      title: "Can I extend my rental.",
      content:
        "Yes, customers have the option to extend their rental once per order. After that, it will be treated as a new order, and the customer must return the existing product. Extensions are subject to availability. Please contact us to request an extension.",
    },
    {
      title: "Will I be charged if I am late to return my rental.",
      content: `Additional fees may apply for late returns. Contact us to make arrangements for a late return.`,
    },
    {
      title: "Do I need to be present at home for delivery.",
      content: `Yes, you or a designated representative should be present to receive and sign for the delivery.`,
    },
    {
      title: "How do I avoid being charged for item damages.",
      content: `Notify us immediately if you receive a damaged item.`,
    },
    {
      title: "How does Ezys ensure the safety and quality of items.",
      content:
        "We have a thorough vetting process and a review system for all listed items.",
    },
    {
      title: "How does Ezys protect my personal information.",
      content: `We use encryption and other security measures to safeguard your information.`,
    },
    {
      title: "Can I increase or decrease the rental period.",
      content: `We do allow date changes after delivery. The amount will be calculated based on the rates mentioned on our website for the corresponding number of days.`,
    },
    {
      title: "What documents and proof I need to submit for order.",
      content: `You need to submit a picture of your identity and current address proof.
                Note: Aadhaar is accepted as both proof of identity and proof of address.`,
    },
    {
      title: "Do I need to deposit any security deposit.",
      content: "Ezys don't take any security deposit.",
    },
    {
      title: "Is shipping charges applicable.",
      content: `Shipping Charges are applicable based on location`,
    },
    {
      title:
        "I am a total beginner and don't have any idea about gaming consoles and VR.",
      content: `You can refer our Quick Guide to know about the usage do's and dont's here`,
    },
  ],
};

const styles = {
  bgColor: "white",
  titleTextColor: "rgb(23 23 23)",
  arrowColor: "rgb(13, 148, 136)",
  rowContentTextSize: "12px",
  rowContentColor: "#818181",
  rowTitleColor: "rgb(13, 148, 136)",
  rowTitleTextSize: "14px",
  rowContentPaddingTop: "5px",
  rowContentPaddingBottom: "8px",
};

const config = {
  animate: true,
  arrowIcon: "V",
  openOnload: 0,
  expandIcon: "+",
  collapseIcon: "-",
};

export default function FAQ() {
  return (
    <main className="content">
      <div className="faq">
        <Faq data={data} styles={styles} config={config} />
      </div>
    </main>
  );
}
