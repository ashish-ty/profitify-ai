import React from 'react';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Dr. Michael Chen',
    title: 'Chief Financial Officer',
    hospital: 'St. Mary\'s Medical Center',
    content: 'Medicost.ai transformed how we approach financial management. The AI insights helped us identify cost savings of over $2M annually.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    name: 'Sarah Williams',
    title: 'Hospital Administrator',
    hospital: 'Regional Medical Center',
    content: 'The real-time analytics and predictive modeling features are game-changers. We can now make data-driven decisions with confidence.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    name: 'Dr. James Rodriguez',
    title: 'Medical Director',
    hospital: 'City General Hospital',
    content: 'Implementation was seamless, and the results were immediate. Our profit margins improved by 18% in the first quarter.',
    rating: 5,
    avatar: 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-secondary-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-primary-900 mb-4">
            Trusted by Healthcare Leaders
          </h2>
          <p className="text-xl text-accent-600 max-w-3xl mx-auto">
            See how leading hospitals are transforming their financial operations with Medicost.ai
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 text-lemon fill-current" />
                ))}
              </div>
              
              <p className="text-accent-700 mb-6 leading-relaxed italic">
                "{testimonial.content}"
              </p>
              
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
                <div>
                  <h4 className="font-semibold text-primary-900">{testimonial.name}</h4>
                  <p className="text-sm text-accent-600">{testimonial.title}</p>
                  <p className="text-sm text-accent-500">{testimonial.hospital}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}