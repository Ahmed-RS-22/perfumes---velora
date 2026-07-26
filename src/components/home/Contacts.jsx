import { Mail, MapPin, Phone } from "lucide-react";

export const ContactSection = () => {
  return (
    <section className="relative w-full py-24 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent"></div>

      <div className="relative z-10 container mx-auto px-6 grid lg:grid-cols-2 grid-cols-1 gap-16 items-center">
        {/* Left Side: Text Info */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <h2 className="text-3xl md:text-5xl font-cinzel font-bold text-heading">
            Get in <span className="text-primary">Touch</span>
          </h2>

          <p className="text-text-muted leading-relaxed max-w-lg">
            We’d love to hear from you! Whether you have a question about our
            collections, need support, or simply wish to share your experience —
            our team is always here to help.
          </p>

          <div className="flex flex-col gap-4 mt-4 text-text-muted">
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <MapPin className="text-primary" />
              <span>123 Velvet Street, Cairo, Egypt</span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <Mail className="text-primary" />
              <span>contact@velora.com</span>
            </div>
            <div className="flex items-center gap-3 justify-center lg:justify-start">
              <Phone className="text-primary" />
              <span>+20 123 456 7890</span>
            </div>
          </div>
        </div>

        {/* Right Side: Contact Form */}
        <div className="bg-card border border-border rounded-3xl p-8 shadow-md2 hover:shadow-lg2 transition-all duration-500">
          <form className="flex flex-col space-y-6">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full px-5 py-3 rounded-full bg-bg border border-border text-text focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full px-5 py-3 rounded-full bg-bg border border-border text-text focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all"
            />
            <textarea
              rows="5"
              placeholder="Your Message"
              className="w-full px-5 py-3 rounded-3xl bg-bg border border-border text-text focus:border-primary focus:ring-1 focus:ring-primary/50 outline-none transition-all resize-none"
            ></textarea>

            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-primary text-bg font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-primary/40"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
