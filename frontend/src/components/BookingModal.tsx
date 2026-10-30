"use client";

import { useState } from "react";

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  serviceName?: string;
  servicePrice?: string;
  onConfirmBooking: (bookingData: {
    serviceName: string;
    date: string;
    time: string;
    customerName: string;
    customerPhone: string;
  }) => void;
};

export default function BookingModal({
  isOpen,
  onClose,
  serviceName = "General Service",
  servicePrice = "$45",
  onConfirmBooking,
}: BookingModalProps) {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !name || !phone) return;

    onConfirmBooking({
      serviceName,
      date: selectedDate,
      time: selectedTime,
      customerName: name,
      customerPhone: phone,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  const timeSlots = ["10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-4 transition-all animate-fade-in">
      <div className="w-full max-w-[390px] bg-[#0c130e] border border-white/15 rounded-[2.5rem] p-6 shadow-[0_0_50px_rgba(57,255,20,0.15)] text-white relative flex flex-col gap-4">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-white text-lg w-8 h-8 rounded-full bg-white/5 flex items-center justify-center transition"
        >
          ✕
        </button>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400 text-3xl shadow-[0_0_20px_rgba(57,255,20,0.4)] animate-bounce">
              ✓
            </div>
            <h3 className="text-lg font-bold text-white">Booking Confirmed!</h3>
            <p className="text-xs text-gray-400 max-w-[240px]">
              We have received your request for <span className="text-emerald-400 font-semibold">{serviceName}</span>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-bold">
                Book Appointment
              </span>
              <h2 className="text-base font-bold text-white">{serviceName}</h2>
              <p className="text-xs text-emerald-400/90 font-semibold mt-0.5">
                Price: {servicePrice}
              </p>
            </div>

            <hr className="border-white/10" />

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 font-medium">Select Date</label>
              <input
                type="date"
                required
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500/60 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs text-gray-300 font-medium">Select Time Slot</label>
              <div className="flex items-center gap-2 overflow-x-auto py-1 no-scrollbar">
                {timeSlots.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedTime(slot)}
                    className={`px-3 py-1.5 text-xs rounded-xl whitespace-nowrap transition border ${
                      selectedTime === slot
                        ? "bg-emerald-500 text-black font-bold border-emerald-400 shadow-[0_0_10px_rgba(57,255,20,0.4)]"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-emerald-500/40"
                    }`}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs text-gray-300 font-medium">Your Contact Information</label>
              <input
                type="text"
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-500/60 transition"
              />
              <input
                type="tel"
                required
                placeholder="Phone Number (e.g. +123456789)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 outline-none focus:border-emerald-500/60 transition"
              />
            </div>

            <button
              type="submit"
              disabled={!selectedDate || !selectedTime || !name || !phone}
              className="w-full mt-2 py-3 bg-gradient-to-r from-emerald-400 to-green-500 text-black font-bold text-xs rounded-xl shadow-[0_0_20px_rgba(57,255,20,0.35)] hover:brightness-110 active:scale-98 transition disabled:opacity-40"
            >
              Confirm Booking
            </button>
          </form>
        )}
      </div>
    </div>
  );
}