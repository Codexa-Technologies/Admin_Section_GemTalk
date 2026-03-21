const faqs = [
  {
    question: "How can I submit a new question?",
    answer:
      "Use the Contact page or WhatsApp button to send your question. Our team will review it and publish the answer if it helps the community.",
  },
  {
    question: "Can I answer questions on the website?",
    answer:
      "Yes. Community answers are welcome. Send your response and we will verify it before displaying it publicly.",
  },
  {
    question: "How long does it take to get a reply?",
    answer:
      "Most questions are answered within 24-48 hours depending on complexity and verification needs.",
  },
  {
    question: "Are expert answers verified?",
    answer:
      "Yes. We review answers from gemology experts and cite sources where possible to keep the information accurate.",
  },
];

export default function FAQ() {
  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Common <span className="text-[#1e95b5]">Questions</span>
          </h2>
          <p className="text-sm text-gray-600">
            Ask, answer, and learn together.
          </p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {faqs.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
            >
              <h3 className="text-base font-semibold text-gray-900">
                {item.question}
              </h3>
              <p className="mt-3 text-sm leading-6 text-gray-600">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
