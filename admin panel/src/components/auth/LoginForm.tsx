
interface LoginFormProps {
  onCreateAccount: () => void;
}

const LoginForm = ({ onCreateAccount }: LoginFormProps) => {
  return (
    <section className="flex flex-col items-start w-full gap-10">
      {/* Title */}
      <h1 className="text-6xl font-bold w-full flex items-center justify-center">Login</h1>

      <form className="flex flex-col items-start w-full" >
        <label htmlFor="email" >Email</label>
        <input type="email" id="email" name="email"
          placeholder="yassine@gmail.com"
          className="w-full border-[#e7e7e7] border rounded-xl p-4 mb-10"
        />

        <label htmlFor="password">Password</label>
        <input type="password" id="password" name="password"
          placeholder="SecretPassword123"
          className="w-full border-[#e7e7e7] border rounded-xl p-4 mb-10"
        />

        <button type="submit"
          className="w-full p-4 bg-[#ff6804] rounded-xl font-bold text-xl text-white cursor-pointer hover:bg-orange-400"
        >
          Login
        </button>
      </form>
      <p className="text-sm text-gray-400">
        Not registered? <span className="text-[#ff6804] cursor-pointer" onClick={onCreateAccount}>create a new account</span>
      </p>
    </section>
  )
}

export default LoginForm