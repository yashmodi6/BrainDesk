<h1>🚀 BrainDesk Production Checklist</h1>

<p><strong>Version:</strong> 1.0.0<br>
<strong>Maintainer:</strong> BrainDesk Team<br>
<strong>Purpose:</strong> Ensure the app is ready for public release</p>

<hr>

<h2>✅ Code Quality</h2>
<ul>
  <li>[ ] All files follow <a href="CODE_COMMENTING_GUIDELINES.html">Commenting Guidelines v1.0</a></li>
  <li>[ ] No unused code, console.logs, or dead imports</li>
  <li>[ ] TypeScript: No type errors (<code>tsc --noEmit</code>)</li>
  <li>[ ] ESLint passes without critical warnings</li>
  <li>[ ] All slice actions and reducers are covered</li>
</ul>

<hr>

<h2>🧪 Testing</h2>
<ul>
  <li>[ ] Unit tests written for settings slice</li>
  <li>[ ] AsyncStorage is properly mocked in tests</li>
  <li>[ ] No test crashes during `npm test` or `expo test`</li>
  <li>[ ] Manual test coverage for:
    <ul>
      <li>Add/Edit/Delete Tasks</li>
      <li>Swipe-to-complete</li>
      <li>Filters and calendar</li>
      <li>Subject management</li>
      <li>Theme switching</li>
    </ul>
  </li>
</ul>

<hr>

<h2>📦 Assets & Config</h2>
<ul>
  <li>[ ] App icon and splash screen defined in <code>app.json</code></li>
  <li>[ ] No placeholder assets in <code>/assets</code></li>
  <li>[ ] All constants moved to <code>/constants/</code></li>
  <li>[ ] <code>.env.example</code> file created for future configs</li>
</ul>

<hr>

<h2>🌐 Meta & SEO</h2>
<ul>
  <li>[ ] <code>README.md</code> and <code>README.html</code> complete</li>
  <li>[ ] <code>production-checklist.html</code> generated</li>
  <li>[ ] <code>LICENSE</code> file present (MIT)</li>
  <li>[ ] Repo has description, topics, and a clean Git history</li>
</ul>

<hr>

<h2>🧠 Feature Freeze (v1.0.0)</h2>
<ul>
  <li>[ ] UI polish for modals and FAB</li>
  <li>[ ] All Redux actions persist correctly to AsyncStorage</li>
  <li>[ ] Only expected features in v1.0 scope:
    <ul>
      <li>✅ Tasks CRUD</li>
      <li>✅ Subjects</li>
      <li>✅ Theme mode</li>
      <li>✅ Export/Import tasks</li>
    </ul>
  </li>
  <li>[ ] Unimplemented future features (e.g., notifications) are stubbed/hidden</li>
</ul>

<hr>

<h2>🔐 Security & Permissions</h2>
<ul>
  <li>[ ] No unnecessary permissions in <code>app.json</code></li>
  <li>[ ] Expo Go does not request unwanted device access</li>
  <li>[ ] No sensitive keys hardcoded</li>
</ul>

<hr>

<h2>📱 Device Testing</h2>
<ul>
  <li>[ ] Tested on Expo Go (Android)</li>
  <li>[ ] Verified on small and large screen sizes</li>
  <li>[ ] System theme switch reflects in UI (system theme mode)</li>
</ul>

<hr>

<h2>☁️ Deployment</h2>
<ul>
  <li>[ ] GitHub repo is public or access-controlled</li>
  <li>[ ] <code>main</code> branch is protected</li>
  <li>[ ] GitHub Actions CI set up (optional)</li>
  <li>[ ] Tagged release with version <code>v1.0.0</code></li>
</ul>

<hr>

<h2>📋 Final Checklist</h2>
<ul>
  <li>[ ] <code>README.md</code> and <code>README.html</code> updated</li>
  <li>[ ] <code>CODE_COMMENTING_GUIDELINES.html</code> included</li>
  <li>[ ] <code>production-checklist.html</code> included</li>
  <li>[ ] Manual walkthrough completed</li>
</ul>

<hr>

<h2>🧠 Notes</h2>
<ul>
  <li>Push roadmap to GitHub issues</li>
  <li>Next milestone: Enable scheduled notifications</li>
</ul>

<hr>

<p><strong>✔️ This document must be checked before merging into <code>main</code>.</strong></p>