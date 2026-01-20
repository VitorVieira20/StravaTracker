# 🏃 Run Tracker - Project Context for Gemini

## 1. Project Overview
**Name:** Run Tracker
**Type:** Personal SaaS / Running Dashboard (TV Mode focus).
**Goal:** Visualize Strava data on large screens, track race goals, and predict race times using the Riegel formula.
**Current State:** Private Beta (waiting for Strava API approval). Moving from API-only to Database persistance for activities.

## 2. Tech Stack & Environment
* **Backend:** Laravel 12 (PHP 8.3+)
* **Frontend:** React (Functional Components) via Inertia.js
* **Database:** MySQL
* **Styling:** Tailwind CSS (Strict Dark Mode)
* **Icons:** Lucide React
* **Charts:** Recharts
* **Integration:** Strava API v3 + Discord Webhooks

## 3. Architecture & Key Files

### Backend Structure
* **Controllers:** Keep them thin. Logic belongs in Services.
    * `DashboardController.php`: Main entry point.
    * `RaceGoalController.php`: CRUD for goals.
    * `StravaAuthController.php`: OAuth flow.
    * `LanguageController.php`: Translations controller.
    * `SupportController.php`: Discord support messages controller.
* **Services:**
    * `StravaService.php`: **CRITICAL**. Handles API Sync (`syncActivities`), Database retrieval, GAP calculation, and Riegel predictions.
    * `RaceGoalService.php`: Formats goal data for the frontend.
* **Models:**
    * `User`: Has `locale` column.
    * `RaceGoal`: Target race info (`race_distance`, `weekly_goal_km`).
    * `StravaAccount`: OAuth tokens.

### Frontend Structure (Inertia/React)
* **Theme:** **Dark Mode Only**. Background: `#18181b`, Cards: `#27272a`, Accent: `#FC4C02` (Strava Orange).
* **Localization:** Uses a custom `useTranslation` hook reading from `page.props.translations`.
    * *Rule:* All UI text must use `t('key')`. Add keys to `lang/pt.json`, `en.json`, etc.
* **Components:**
    * `Dashboard/SideContent.jsx`: Sidebar with Goal countdown + Language switcher.
    * `Dashboard/MainContent.jsx`: Carousel logic.
    * `Dashboard/Slides/*.jsx`: The visual slides (Chart, LastRun, WeeklyGrid).

## 4. Database Schema (Key Tables)

### `race_goals`
* `user_id`
* `name`
* `race_distance` (decimal 8,3): Distance in KM (e.g., 42.195).
* `weekly_goal_km` (int): Weekly target.
* `race_date`, `start_date`, `location`.


## 5. Coding Guidelines & Style

### 🎨 Design System (Tailwind)
* **Backgrounds:** `bg-[#18181b]` (Main), `bg-[#27272a]` (Cards/Panels).
* **Text:** `text-white` (Headings), `text-gray-400` (Subtitles/Labels).
* **Brand:** `text-[#FC4C02]` / `bg-[#FC4C02]` (Action buttons, Highlights).
* **Inputs:** No default browser styles. Use rounded-xl, dark borders.

### 🧠 Logic Rules
1.  **Sync First, Read Later:** In `StravaService`, always sync new activities from API to DB, then query the DB (Eloquent) for display.
2.  **Smart Filtering:** The Race Predictor removes short runs (warm-ups) based on the target distance.
    * Target > 10k: Filter runs < 3km.
    * Target < 5k: Filter runs < 1km.
3.  **Localization:** Do not hardcode strings in JSX. Use `t('string_key')`.

### ⚡ Common Commands
* `php artisan migrate`: Update DB schema.
* `php artisan queue:work`: Process webhooks/jobs.
* `npm run dev`: Compile assets.

## 6. Current Context / Active Tasks
* Implementing **Activity Log Page** (`/activities`) with search, sort, and pagination.
* Moving away from real-time API dependency to Database persistence to avoid rate limits.
* Refining the **Race Predictor** algorithm.