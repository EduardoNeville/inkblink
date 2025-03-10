# PROMPT ad78664d-db83-48d3-8024-a47cc5d8711f


I want my website to have a white background and use a deep blue ink color as the primary.
Here are the colours I chose.
primary: HEX=#000066 HSL=(240, 100, 20) OKLCH=oklch(23.07% 0.1598 264.05)
secondary: HEX=#6666ff HSL=(240, 100, 70) oklch(59.81% 0.2213 277.36)
accent: HEX=#e5e5ff HSL=(240, 100, 95) oklch(92.98% 0.0351 285.7)

edit the index.css file so that the theme is properly managed
Find colours that would match the style

# OUTPUT ad78664d-db83-48d3-8024-a47cc5d8711f
Here is the updated `index.css` file to integrate your preferred colors into the theme while maintaining a balanced style.

### **Changes made:**
- **Primary color:** Deep Blue (`#000066`)
- **Secondary color:** Vibrant Blue (`#6666ff`)
- **Accent color:** Soft Blue (`#e5e5ff`)
- **Matching shades:**
  - **Background:** White (`#ffffff`)
  - **Foreground (Text on white):** Deep grayish blue to provide contrast
  - **Muted (Subdued elements):** Lighter shades of grayish blue
  - **Destructive:** A red tone (`#d33f49`) for error states
  - **Charts:** Harmonized blues and purples for consistency

---

### **Updated `index.css` File:**

```css
@import "tailwindcss";
@plugin "tailwindcss-animate";

@custom-variant dark (&:is(.dark *));

/* Light Theme */
:root {
  --background: oklch(1 0 0);                      /* White */
  --foreground: oklch(0.2 0.032 270);              /* Dark Blue-Gray, for text */
  --card: oklch(1 0 0);                            /* Matches background */
  --card-foreground: oklch(0.2 0.032 270);
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.2 0.032 270);
  
  --primary: oklch(23.07% 0.1598 264.05);          /* Deep Blue */
  --primary-foreground: oklch(98% 0 0);            /* White text on deep blue */
  
  --secondary: oklch(59.81% 0.2213 277.36);        /* Vibrant Blue */
  --secondary-foreground: oklch(0.2 0.032 270);

  --accent: oklch(92.98% 0.0351 285.7);           /* Light Blue */
  --accent-foreground: oklch(0.2 0.032 270);

  --muted: oklch(85% 0.04 270);                   /* Subtle bluish gray */
  --muted-foreground: oklch(50% 0.07 270);       /* Slightly faded text */
  
  --destructive: oklch(60% 0.18 27);              /* Red for errors */
  --destructive-foreground: oklch(96% 0 0);      /* White text on red */

  --border: oklch(90% 0.02 270);                  /* Light grayish blue */
  --input: oklch(90% 0.02 270);
  --ring: oklch(40% 0.15 270);                   /* Strong blue for focus rings */

  /* Chart colors for data visualizations */
  --chart-1: oklch(35% 0.25 265);
  --chart-2: oklch(60% 0.22 277);
  --chart-3: oklch(45% 0.20 250);
  --chart-4: oklch(65% 0.21 285);
  --chart-5: oklch(50% 0.15 270);

  --radius: 0.625rem;
  
  /* Sidebar color scheme */
  --sidebar: oklch(95% 0.01 270);
  --sidebar-foreground: oklch(0.2 0.032 270);
  --sidebar-primary: oklch(23.07% 0.1598 264.05);
  --sidebar-primary-foreground: oklch(98% 0 0);
  --sidebar-accent: oklch(92.98% 0.0351 285.7);
  --sidebar-accent-foreground: oklch(0.2 0.032 270);
  --sidebar-border: oklch(85% 0.04 270);
  --sidebar-ring: oklch(40% 0.15 270);
}

/* Dark Theme */
.dark {
  --background: oklch(0.15 0.02 270);            /* Dark blue-gray */
  --foreground: oklch(92.98% 0.0351 285.7);      /* Light blue */
  --card: oklch(0.15 0.02 270);
  --card-foreground: oklch(92.98% 0.0351 285.7);
  --popover: oklch(0.15 0.02 270);
  --popover-foreground: oklch(92.98% 0.0351 285.7);

  --primary: oklch(59.81% 0.2213 277.36);       /* Vibrant Blue */
  --primary-foreground: oklch(0.15 0.02 270);
  
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(92.98% 0.0351 285.7);

  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);

  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(92.98% 0.0351 285.7);

  --destructive: oklch(50% 0.18 27);
  --destructive-foreground: oklch(98% 0 0);

  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);

  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);

  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(92.98% 0.0351 285.7);
  --sidebar-primary: oklch(35% 0.25 265);
  --sidebar-primary-foreground: oklch(92.98% 0.0351 285.7);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(92.98% 0.0351 285.7);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### **Explanation of Edits:**
- **Primary colors adjusted** to use **Deep Blue, Vibrant Blue, and Soft Blue**.
- **Foreground and Secondary foreground** optimized for readability.
- **Border and input colors** chosen to match the aesthetic while keeping contrast.
- **Dark mode adjustments** match the light theme while staying readable.
- **Neutral and contrast-friendly chart colors** fitting the theme.

This setup ensures that your theme has a **modern, readable, and accessibility-friendly** look while keeping it aesthetically pleasing with deep blues. 🚀

# ASK MODEL BELLOW

I want you to fix the Navbar so that when you hover and 
