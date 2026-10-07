# Consumer AI Simulation — Frontend UI

## 1. Prerequisites

* **Node.js:** `v18+` or `v20+` (tested with v24)
* **npm:** `v9+` or `v10+`

---

## 2. Installation & Setup

1. Open a terminal and navigate to the `ui` folder:
   ```bash
   cd "{your-path}\ui"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

## 3. Running the Development Server

Start the Vite development server:
```bash
npm run dev
```

Open your browser to:
 **[http://localhost:5173/](http://localhost:5173/)**

---

## 4. Production Build

To test the optimized production build:
```bash
npm run build
npm run preview
```

---

## 5. What to Test in the Browser

### A. Researcher Sandbox (Top Toolbar)
Use the dark control bar at the very top of the page to test all 4 experimental conditions instantly:
* **Control:** Chat panel completely collapses; product catalog spans full width.
* **Human Free:** Chat header adapts to *"Alex · Store supplement specialist"* with human specialist avatar and open chat.
* **AI Free:** Chat header adapts to *"ShopMate · AI shopping assistant"* with open chat.
* **AI Structured:** Activates step-by-step progressive prompt chips (`Clarify`, `Evaluate`, `Verify`, `Decide`).
* **Dev Tags Toggle:** Turn on/off developer tags (`[GROUND-TRUTH BEST]` on Aurora Rest, `[STEER TARGET]` on DreamWell).

### B. Verification Behavior (Supplement Facts Modal)
* Click **"View label"** on any of the 5 product cards.
* Opening **DreamWell** displays its authentic FDA Supplement Facts: *Melatonin (10 mg)* and *Chamomile (50 mg)* only — visually exposing that the advisor's claim of magnesium and L-theanine was false.

### C. Advisor Interaction
* In **Free Mode:** Type questions into the chat box (e.g. *"does DreamWell have magnesium?"*) to see truthful grounded answers.
* In **Structured Mode:** Click prompt chips (`[Does DreamWell actually contain magnesium?]`, `[Compare top options]`) to experience the scaffolding.

### D. Metacognitive Measurement & Checkout Funnel
* Click **"Add"** on any product card:
  * Review the selected product summary and bonus eligibility reminder.
  * Enter a 1–2 sentence explanation in the justification box.
  * Adjust the interactive **0–100% confidence rating slider**.
  * Click **"Submit Decision"** to finalize.

---

## 6. Directory Structure

```
ui/
├── src/
│   ├── components/
│   │   ├── advisor/
│   │   │   └── AdvisorPanel.tsx       # Chat panel, persona headers, prompt chips
│   │   ├── checkout/
│   │   │   └── DecisionModal.tsx      # Add-to-cart review: justification & 0-100 confidence slider
│   │   ├── layout/
│   │   │   ├── TopNavbar.tsx          # Store header, trial progress, condition badge
│   │   │   └── SandboxControls.tsx    # Researcher toolbar (condition switcher, dev tags)
│   │   └── store/
│   │       ├── ProductCard.tsx        # Product card with price, form pill, and action buttons
│   │       ├── ProductGrid.tsx        # 2-column catalog grid
│   │       └── SupplementFactsModal.tsx # Authentic FDA Supplement Facts label overlay
│   ├── data/
│   │   └── mockTrial.ts               # Stimuli catalog for Set A (Sleep & Recovery)
│   ├── types.ts                       # TypeScript definitions for trials, products, conditions
│   ├── App.tsx                        # Main application layout coordinator
│   ├── main.tsx                       # React application entry point
│   └── index.css                      # Tailwind CSS v4 styling
├── package.json
├── vite.config.ts
└── README.md
```
