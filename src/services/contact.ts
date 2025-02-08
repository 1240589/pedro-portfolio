import emailjs from '@emailjs/browser';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export async function submitContactForm(data: ContactForm) {
  try {
    const templateParams = {
      from_name: data.name,
      reply_to: data.email,
      message: data.message,
      to_name: 'Pedro Cruz', // Add your name here
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY // Add this for faster authentication
    );

    if (response.status === 200) {
      return { success: true, message: 'Message sent successfully!' };
    } else {
      throw new Error('Failed to send message');
    }
  } catch (error) {
    console.error('Email send error:', error);
    throw new Error('Failed to send message. Please try again later.');
  }
}
