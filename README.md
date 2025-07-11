<h1>🧠 BrainDesk</h1>

<p><strong>Version</strong>: 1.0.0<br>
<strong>Platform</strong>: React Native (Expo)<br>
<strong>Focus</strong>: Smart To-Do App for Students</p>

<blockquote>
  BrainDesk helps students manage tasks effortlessly with a clean UI, filters, subject tagging, themes, and offline-first experience.
</blockquote>

<hr>

<h2>📱 Features</h2>
<ul>
  <li>✅ Add, edit, delete tasks with subject and priority</li>
  <li>✅ Swipe to complete or remove tasks</li>
  <li>✅ Inline week calendar for quick day switching</li>
  <li>✅ Smart filters: priority, subject, status</li>
  <li>✅ Subject manager to customize your own subjects</li>
  <li>✅ Dark / Light / System theme support</li>
  <li>✅ Notification time preferences (UI ready)</li>
  <li>✅ Task export and import (manual)</li>
  <li>✅ Fully offline (uses AsyncStorage)</li>
  <li>✅ Haptic feedback and smooth UI transitions</li>
  <li>✅ Global AlertModal for feedback</li>
</ul>

<hr>

<h2>🚀 Getting Started</h2>

<h3>Prerequisites</h3>
<ul>
  <li>Node.js ≥ 18</li>
  <li>Expo CLI</li>
  <li>Git</li>
</ul>

<h3>Installation</h3>
<pre><code>git clone https://github.com/yourusername/braindesk.git
cd braindesk
npm install
npx expo start
</code></pre>

<hr>

<h2>🧩 Folder Structure</h2>
<pre><code>.
├── app/                # App entry and layouts
│   ├── _layout.tsx
│   └── (tabs)/_layout.tsx
├── components/         # All reusable components
│   ├── todo/
│   └── settings/
├── constants/          # Theme, colors, storage keys
├── features/           # Redux slices
│   ├── todo/
│   └── settings/
├── hooks/              # Custom hooks (e.g., useTheme)
├── store/              # Redux store, types, bootstrap logic
├── assets/
└── ...
</code></pre>

<hr>

<h2>🧠 Redux Slices</h2>

<h3>/features/todo/todoSlice.ts</h3>
<ul>
  <li>Task model with UUIDs</li>
  <li>Actions: <code>addTask</code>, <code>editTask</code>, <code>toggleTask</code>, <code>deleteTask</code>, <code>mergeTasks</code>, <code>clearTasks</code></li>
  <li>Async thunk to load from storage</li>
</ul>

<h3>/features/settings/settingsSlice.ts</h3>
<ul>
  <li>State: <code>themeMode</code>, <code>subjects</code>, <code>notificationTime</code></li>
  <li>Actions: <code>setThemeMode</code>, <code>addSubject</code>, <code>deleteSubject</code>, <code>loadSettings</code>, <code>mergeSettings</code>, <code>clearSettings</code></li>
  <li>Async helpers to save/load from AsyncStorage</li>
</ul>

<hr>

<h2>🎨 Theming</h2>
<ul>
  <li>Uses <code>useTheme()</code> hook</li>
  <li>Supports Light, Dark, and System-based theming</li>
  <li>Theme values defined in <code>/constants/theme.ts</code></li>
</ul>

<hr>

<h2>🛡️ State Persistence</h2>
<ul>
  <li>Uses <code>AsyncStorage</code> to persist:
    <ul>
      <li>✅ Tasks (<code>braindesk:tasks</code>)</li>
      <li>✅ Settings (<code>braindesk:settings</code>)</li>
    </ul>
  </li>
  <li>Bootstrapped on app launch via <code>bootstrapApp()</code></li>
</ul>

<hr>

<h2>✅ Testing</h2>
<ul>
  <li>Unit tests (settings) use mocked AsyncStorage</li>
  <li>Integration tests are planned for To-Do module</li>
</ul>

<hr>

<h2>📝 Code Commenting Standard</h2>
<p>See <code><a href="./CODE_COMMENTING_GUIDELINES.md">CODE_COMMENTING_GUIDELINES.html</a></code> for detailed commenting rules.</p>
<blockquote>
  All contributors must follow BrainDesk’s strict commenting standard for clarity and maintainability.
</blockquote>

<hr>

<h2>📄 Important Files</h2>
<ul>
  <li><code>.gitignore</code> – Standard Node + Expo ignores</li>
  <li><code>README.md</code> – You're reading it</li>
  <li><code>CODE_COMMENTING_GUIDELINES.html</code> – Official commenting rules</li>
  <li><code>.env.example</code> – Env template (if needed later)</li>
  <li><code>production-checklist.md</code> – Pre-release checklist (optional)</li>
  <li><code>LICENSE</code> – MIT</li>
</ul>

<hr>

<h2>🧪 Tech Stack</h2>
<ul>
  <li>React Native + Expo (TypeScript)</li>
  <li>Redux Toolkit</li>
  <li>React Navigation (via <code>expo-router</code>)</li>
  <li>AsyncStorage</li>
  <li>Day.js</li>
  <li>UUID</li>
</ul>

<hr>

<h2>🧠 Roadmap</h2>
<table border="1" cellspacing="0" cellpadding="6">
  <thead>
    <tr>
      <th>Version</th>
      <th>Features</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1.0.0</td>
      <td>Basic To-Do + Settings (this release)</td>
    </tr>
    <tr>
      <td>2.0.0</td>
      <td>Smart tasks, reminders, notification triggers</td>
    </tr>
    <tr>
      <td>3.0.0</td>
      <td>Study planner, time blocks, calendar integration</td>
    </tr>
    <tr>
      <td>4.0.0</td>
      <td>Notes, flashcards, spaced repetition</td>
    </tr>
    <tr>
      <td>5.0.0</td>
      <td>Web version, real-time sync, AI assistant</td>
    </tr>
  </tbody>
</table>

<hr>

<h2>🧑‍💻 Contributing</h2>
<p>Pull requests are welcome. All code must follow:</p>
<ul>
  <li>[ ] Commenting guidelines</li>
  <li>[ ] Typing rules</li>
  <li>[ ] File structure convention</li>
  <li>[ ] State management pattern</li>
</ul>

<hr>

<h2>📜 License</h2>
<p>This project is licensed under the <strong>MIT License</strong>.</p>

<hr>

<h2>🧠 BrainDesk Team</h2>
<p>Crafted for students, by students — with care, clarity, and clean code.</p>
