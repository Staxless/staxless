// /components/Features.js
export default function Features() {
  const features = [
    { title: "Easy to Use", description: "Simple and intuitive design." },
    {
      title: "Powerful Automation",
      description: "Automate workflows seamlessly.",
    },
    { title: "Secure", description: "Enterprise-grade security." },
  ];

  return (
    <section className="container mx-auto py-20">
      <h2 className="text-3xl text-center font-bold">Features</h2>
      <div className="mt-8 flex justify-around">
        {features.map((feature, index) => (
          <div key={index} className="text-center p-4">
            <h3 className="text-xl font-bold">{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
