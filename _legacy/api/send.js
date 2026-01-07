export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { name, email, reason, message } = req.body;

  try {
    const formData = new URLSearchParams();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("reason", reason);
    formData.append("message", message);

    // FormSubmit options
    formData.append("_captcha", "false");
    formData.append("_subject", "New Contact Form Submission!");
    formData.append("_template", "box");

    const response = await fetch(
      "https://formsubmit.co/ajax/singhsomnath2006@gmail.com",
      {
        method: "POST",
        body: formData
      }
    );

    const result = await response.json();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ success: false });
  }
}
