<h1>🧠 BrainDesk Code Commenting Guidelines</h1>

<p><strong>Version:</strong> 1.0<br>
<strong>Applies To:</strong> All <code>.ts</code>, <code>.tsx</code>, <code>.js</code>, <code>.jsx</code> files in the BrainDesk project<br>
<strong>Enforced By:</strong> All contributors and reviewers<br>
<strong>Purpose:</strong> To ensure consistent, clear, and maintainable comments across the entire codebase.</p>

<hr>

<h2>📌 1. General Principles</h2>
<ul>
  <li>Write <strong>why</strong>, not just what.</li>
  <li>Comments must <strong>add value</strong> — do not restate obvious code.</li>
  <li>Use <strong>complete sentences</strong>, <strong>proper grammar</strong>, and <strong>punctuation</strong>.</li>
  <li>Place comments <strong>above</strong> the code they reference.</li>
  <li>Keep comments <strong>concise</strong> but <strong>clear</strong>.</li>
  <li>Always write comments in <strong>English</strong>.</li>
  <li>Prioritize <strong>clarity over cleverness</strong>.</li>
</ul>

<hr>

<h2>🗂 2. File Header Comments</h2>
<p>Every file must begin with a descriptive header.</p>
<p><strong>✅ Required For:</strong></p>
<ul>
  <li>All Redux slices</li>
  <li>All component files</li>
  <li>Utility and hook files</li>
</ul>

<p><strong>🧾 Format:</strong></p>
<pre><code>/**
 * File: TaskList.tsx
 * Description: Renders the list of user tasks with filters and swipe support.
 * Author: BrainDesk Team
 * Created: 2025-07-10
 */
</code></pre>

<hr>

<h2>🧠 3. Function and Method Comments</h2>
<p>Use <strong>JSDoc-style</strong> blocks for all exported or complex functions.</p>

<p><strong>✅ Include:</strong></p>
<ul>
  <li>What the function does</li>
  <li>Input parameters (<code>@param</code>)</li>
  <li>Return value (<code>@returns</code>)</li>
</ul>

<p><strong>🧾 Example:</strong></p>
<pre><code>/**
 * Filters tasks based on subject and priority.
 * 
 * @param tasks - List of all tasks
 * @param filters - Filters object with subject and priority
 * @returns Filtered list of tasks
 */
function filterTasks(tasks: Task[], filters: FilterState): Task[] { ... }
</code></pre>

<hr>

<h2>💡 4. Inline Comments</h2>
<p>Use inline comments <strong>only for non-obvious logic</strong>.</p>

<p><strong>✅ Do:</strong></p>
<pre><code>// Prevent crash if store isn't ready on initial render
if (!storeReady) return null;
</code></pre>

<p><strong>❌ Don’t:</strong></p>
<pre><code>let i = 0; // initialize i
</code></pre>

<hr>

<h2>🔲 5. Section Dividers</h2>
<p>Visually group logic with stylized section dividers.</p>

<p><strong>🧾 Format:</strong></p>
<pre><code>// ─────────────────────────────────────────────
// 🔽 Redux Action Creators
// ─────────────────────────────────────────────
</code></pre>

<p><strong>✅ Good Use Cases:</strong></p>
<ul>
  <li>Redux slices</li>
  <li>Long components</li>
  <li>Utility modules</li>
</ul>

<hr>

<h2>🛠 6. TODO and 🐞 FIXME Tags</h2>
<p>Use these to flag unfinished or problematic logic.</p>

<p><strong>🧾 Format:</strong></p>
<pre><code>// TODO: Add error animation to modal
// FIXME: Notifications sometimes fire twice — needs debounce
</code></pre>

<p><strong>✅ Always explain what and why.</strong><br>
<strong>❌ Never leave vague:</strong> <code>// TODO: fix this</code></p>

<hr>

<h2>📄 7. JSDoc Tags</h2>

<p><strong>Supported tags:</strong></p>
<ul>
  <li><code>@param</code> – describe function inputs</li>
  <li><code>@returns</code> – describe outputs</li>
  <li><code>@example</code> – usage examples (optional)</li>
  <li><code>@deprecated</code> – mark outdated logic</li>
</ul>

<p><strong>🧾 Example:</strong></p>
<pre><code>/**
 * Converts Date to YYYY-MM-DD ISO format.
 * 
 * @param date - JS Date object
 * @returns ISO string format
 */
function toISODate(date: Date): string { ... }
</code></pre>

<hr>

<h2>🚫 8. What Not to Do</h2>

<p><strong>❌ Do <em>not</em>:</strong></p>
<ul>
  <li>Comment obvious code</li>
  <li>Leave outdated or misleading comments</li>
  <li>Use casual tone ("hacky but works lol")</li>
  <li>Leave commented-out old code without explanation</li>
  <li>Write comments that contradict the code</li>
</ul>

<hr>

<h2>✅ 9. Examples</h2>

<h3>✅ Good Comments</h3>

<pre><code>// Reset filters when user selects "All"
dispatch(clearSubjectFilters());
</code></pre>

<pre><code>/**
 * Schedules a local push notification for a task.
 * 
 * @param task - Task data including title and time
 * @returns Notification ID string
 */
async function scheduleNotification(task: Task): Promise<string> { ... }
</code></pre>

<h3>❌ Bad Comments</h3>

<pre><code>// do something with tasks
doSomething();
</code></pre>

<pre><code>// FIX THIS
handleInput();
</code></pre>

<hr>

<h2>🏁 Final Notes</h2>
<ul>
  <li>If it takes longer than <strong>5 seconds</strong> to understand a block, comment it.</li>
  <li>Review <strong>comments as seriously as code</strong> in PRs.</li>
  <li>When in doubt, <strong>opt for clarity</strong>.</li>
  <li>Consistency is key to long-term maintainability.</li>
</ul>

<hr>

<p><strong>All BrainDesk contributors must follow these standards without exception.</strong></p>
<p>🧠 <em>Let clean comments drive a clean codebase.</em></p>