import BookingForm from "@/components/BookingForm";
import NowServingPublic from "@/components/NowServingPublic";

export default function BookingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Hero strip */}
      <div className="medical-gradient py-12 px-4">
        <div className="max-w-lg mx-auto text-center text-primary-foreground">
          <h1 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ lineHeight: 1.1 }}>
            Book Your Appointment
          </h1>
          <p className="mt-3 text-primary-foreground/80 text-base max-w-md mx-auto">
            Schedule a visit for today or tomorrow. Quick, easy, and hassle-free.
          </p>
        </div>
      </div>

      {/* Now Serving + Form */}
      <div className="max-w-lg mx-auto px-4 -mt-6 space-y-5">
        <NowServingPublic />
        <div className="bg-card rounded-xl shadow-xl shadow-primary/5 border border-border p-6 sm:p-8">
          <BookingForm />
        </div>
      </div>

      <div className="h-12" />
    </div>
  );
}
