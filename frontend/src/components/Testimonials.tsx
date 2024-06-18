// /components/Testimonials.js
export default function Testimonials() {
  const testimonials = [
    { name: "John Doe", feedback: "This service is amazing!" },
    { name: "Jane Smith", feedback: "Highly recommend to everyone." },
  ];

  return (
    <section className="bg-gray-100 py-20">
      <h2 className="text-3xl text-center font-bold">Testimonials</h2>
      <div className="mt-8 flex justify-around">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="text-center p-4">
            {/* <p>"{testimonial.feedback}"</p> */}
            <h4 className="mt-4 font-bold">{testimonial.name}</h4>
          </div>
        ))}
      </div>
    </section>
  );
}
