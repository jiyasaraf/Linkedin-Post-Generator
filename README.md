# 🚀 LinkedIn Post Generator

A powerful, client-side web application that helps you research trending topics, generate engaging LinkedIn posts, and create AI-generated images—all in one place.

![LinkedIn Post Generator Screenshot](https://placehold.co/800x400/e2e8f0/1e293b?text=LinkedIn+Post+Generator+Preview)

## ✨ Features

*   **🔍 Trending Topic Research**: Discover high-engagement topics in your industry using Google's **Gemini API**.
*   **✍️ Personalized Post Generation**: Generate professional LinkedIn posts tailored to your writing style.
*   **🎨 AI Image Generation**: Automatically create relevant, copyright-free images using **Puter.js** (no API key required!).
*   **📅 Optimal Posting Times**: Get AI-driven suggestions for the best day and time to post for maximum reach.
*   **⚡ Instant Actions**: Copy posts, download images, or share directly to LinkedIn with a single click.

## 🛠️ Tech Stack

*   **Frontend**: HTML5, Vanilla JavaScript, CSS3
*   **Styling**: Tailwind CSS (via CDN)
*   **AI Models**:
    *   **Text & Trends**: Google Gemini 2.0 Flash
    *   **Images**: Puter.js (Stable Diffusion/Flux)
*   **Icons**: Heroicons (SVG)

## 🚀 Getting Started

### Prerequisites

You will need a **Google Gemini API Key**.
1.  Go to [Google AI Studio](https://aistudio.google.com/).
2.  Create a free API key.

*Note: Image generation is handled by Puter.js and does **not** require a separate API key.*

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/linkedin-post-generator.git
    cd linkedin-post-generator
    ```

2.  **Run the application**:
    Since this is a client-side app, you can open `index.html` directly in your browser, or serve it locally for the best experience:

    ```bash
    # Using npx (requires Node.js)
    npx serve .
    
    # Or using Python
    python -m http.server
    ```

3.  **Open in Browser**:
    Navigate to `http://localhost:3000` (or the port shown in your terminal).

### Configuration

1.  On first load, click the **Settings** (gear icon) in the top right.
2.  Enter your **Gemini API Key**.
3.  Click **Save**. Your key is stored locally in your browser for future use.

## 📖 How to Use

1.  **Find Topics**: Enter a broad keyword (e.g., "SaaS Marketing") and click "Find Trending Topics".
2.  **Select a Topic**: Click on a suggested topic to auto-fill the generator.
3.  **Customize**:
    *   (Optional) Paste a few of your previous posts to match your writing style.
    *   Select the number of variations (1-5).
4.  **Generate**: Click "Generate Post(s) & Image(s)".
5.  **Share**: Download the generated image and copy the text to post on LinkedIn!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
