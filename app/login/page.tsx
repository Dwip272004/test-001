export default async function Login({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  return (
    <section className="panel" style={{ maxWidth: 380 }}>
      <h1>Sign in</h1>
      <form method="post" action="/api/login">
        <label htmlFor="password">Team password
          <input id="password" name="password" type="password" required autoFocus />
        </label>
        {error && <p className="error">Wrong password. Try again.</p>}
        <button type="submit">Sign in</button>
      </form>
    </section>
  );
}
