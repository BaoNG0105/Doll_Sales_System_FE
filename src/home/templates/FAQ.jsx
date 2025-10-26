import React from 'react';
import '../static/css/FAQ.css';

const faqData = [
    {
        question: "How do I create an account on Doll World?",
        answer: "Go to the Register page and fill in your email, password, and required details."
    },
    {
        question: "Can I use the website without registering?",
        answer: "Yes, guests can browse public pages and dolls, but cannot make purchases."
    },
    {
        question: "How do I verify my email address?",
        answer: "After registration, you will receive an email with a verification link."
    },
    {
        question: "Can I change my account information?",
        answer: "Yes, you can update personal details except for verified email addresses."
    },
    {
        question: "Which payment methods are supported?",
        answer: "We accept Visa, MasterCard, and PayPal."
    },
    {
        question: "When is my order confirmed?",
        answer: "After successful payment, you’ll receive a confirmation email with order details."
    },
    {
        question: "How can I track my order?",
        answer: "Go to 'My Orders' to see status: Confirmed → Shipping → Delivered."
    },
    {
        question: "Can I cancel an order?",
        answer: "Orders can be canceled before shipment; cancellation reason will be logged in the system."
    },
    {
        question: "When does the warranty start?",
        answer: "Warranty starts once the order status is marked as 'Delivered'."
    },
    {
        question: "Can I own multiple dolls?",
        answer: "Yes, you can own multiple dolls, each with a unique ID and certificate."
    },
    {
        question: "How do I integrate AI into my doll?",
        answer: "AI integration works only if the Doll and AI package share the same product ID."
    },
    {
        question: "Can I deactivate a doll?",
        answer: "Yes, customers can deactivate their dolls anytime from their account dashboard."
    },
    {
        question: "What happens when AI subscription expires?",
        answer: "You’ll receive a reminder 30 days before expiration to renew or extend it."
    },
    {
        question: "Can I transfer my doll or AI to another account?",
        answer: "No, ownership and warranty are bound to the original account."
    },
    {
        question: "Can I request to delete my data?",
        answer: "Yes, send a deletion request through the Contact page."
    },
    {
        question: "Is my payment information stored?",
        answer: "No, we do not store card details. Payments are handled by secure gateways."
    },
    {
        question: "What is the warranty policy?",
        answer: "Warranty applies only to dolls or AI marked as 'Delivered' and within the warranty period."
    },
    {
        question: "Can I request a refund?",
        answer: "Yes, refunds can be requested with a valid reason and you can contact to the admin."
    },
    {
        question: "How do I contact customer service?",
        answer: "Use the Contact form or email support@dollworld.com for assistance."
    },
    {
        question: "Are promotions or discounts available?",
        answer: "Currently, Doll World does not offer promotions or point systems."
    }
];

const FAQ = () => {
    return (
        <div className="faq-container">
            <h1>Frequently Asked Questions</h1>
            <div className="faq-list">
                {faqData.map((item, index) => (
                    <details key={index} className="faq-item">
                        <summary className="faq-question">{item.question}</summary>
                        <p className="faq-answer">{item.answer}</p>
                    </details>
                ))}
            </div>
        </div>
    );
};

export default FAQ;