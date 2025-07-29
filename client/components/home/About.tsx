import React from "react";

const About = () => {
  const steps = [
    {
      image: "/images/a1.png",
      title: "Sketching",
      description:
        "This artistic process starts from a Fashion illustration, which works as a blueprint of the complete design. The preliminary sketch (Khaka) of the illustration is then traced on paper.",
    },
    {
      image: "/images/a2.png",
      title: "Fabrication",
      description:
        "Suitable fabrics are selected from a huge variety of Premium quality fabrics, which includes net, organza, raw silk, pure, tissue etc.",
    },
    {
      image: "/images/a3.png",
      title: "Dyeing",
      description:
        "The fabric is then dyed with vibrant color language according to the Layout. Varzan is known for using the finest quality colors for dying its dresses.",
    },
    {
      image: "/images/a4.png",
      title: "Adda work",
      description:
        "The Fabric is then nailed to a wooden frame and then decorated with threads, beads, yarns, pearls, quills, and sequins using needles.",
    },
    {
      image: "/images/a5.png",
      title: "Pattern making",
      description:
        "A sample paper or fabric is then chopped according to the complete pattern of the design.",
    },
    {
      image: "/images/a6.png",
      title: "Stitching",
      description:
        "After the Adda work, the tailor cuts the fabric according to the pattern made prior.",
    },
    {
      image: "/images/a7.png",
      title: "Final touching",
      description:
        "This process involves incorporating the finishing materials such as tussles, poles, belts, zips, etc. Final inspection of the dress along with the neatening of small details is processed. The final product is then steam pressed to make it ready to ship and wear condition.",
    },
    {
      image: "/images/a8.png",
      title: "Dispatch",
      description:
        "Dresses are then detailed packed in appealing solid boxes and delivered.",
    },
  ];

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 py-10 sm:py-20">
      <h1 className="text-center text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest">
        Welcome <br />
        <span className="text-primary lowercase">to</span> <br />
        Varzan
      </h1>
      <p className="mt-8 text-base sm:text-lg text-gray-700 leading-relaxed text-justify">
        We bring your attention to Varzan, a name known for symbolizing elegance
        and luxury since the 1980s.The company offers manufacturing and whole
        sale for an immense range of eastern luxury, formals, Haute Couture, and
        bridal dresses delivered worldwide. We have not only gained trust among
        the retailers of Pakistan but also among retailers internationally. Our
        designs are a unique blend of feminine fragility and power that reflect
        traditional craftsmanship in a modern way. Our brand is known for the
        high-quality fabric, rich organic color story, and magnicent designs
        fused with sublime cuts and silhouettes dening the modern era through
        traditional manner. We have an ample amount of production capacity along
        with a vast variety of designs for all our categories with the best
        quality standards around. Our main variety includes bridal, maxi, gown,
        balochi, frock, shirt, cape, shari, talpatt, Dhaka Sharara, Gharara set,
        Uptan, mehndi, Peshwas with matha pati and semi stitch lite category.
      </p>
      <div className="flex flex-col items-center justify-center mt-8 space-y-4">
        <img src="/images/logo-icon.png" alt="" className="w-20 sm:w-auto" />
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl uppercase tracking-widest">
          Process <br />
          <span className="text-primary lowercase">to</span> <br />
          Manufacturing
        </h1>
      </div>
      <div className="mt-8">
        {steps.map((step, index) => (
          <div
            className="flex relative even:flex-row-reverse group"
            key={index}
          >
            <div className="w-1/2  h-[40vh] border-secondary flex items-center justify-center group-even:border-l-2 group-odd:border-r-2">
              <img src={step.image} alt="" className="w-28 sm:w-70" />
            </div>
            <div className="w-1/2 h-[40vh] border-secondary flex flex-col group-even:border-r-2 group-even:border-secondary group-odd:border-l-2">
              <div className="h-1/2"></div>
              <div className="h-1/2 px-4 flex justify-center -translate-y-4">
                <div>
                  <h2 className="text-lg sm:text-2xl">{step.title}</h2>
                  <p className="text-xs sm:text-base text-justify max-w-md mt-4">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute w-3 h-3 rounded-full left-1/2 top-1/2 -translate-1/2 bg-secondary"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default About;
