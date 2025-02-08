import emailjs from '@emailjs/browser';

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

// Initialize EmailJS
emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);

export async function submitContactForm(data: ContactForm) {
  try {
    const templateParams = {
      from_name: data.name,
      reply_to: data.email,
      message: data.message,
    };

    const response = await emailjs.send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams
    );

    console.log('SUCCESS!', response.status, response.text);
    return { message: 'Email sent successfully!' };
  } catch (error) {
    console.error('FAILED...', error);
    throw new Error('Failed to send message. Please try again later.');
  }
}
