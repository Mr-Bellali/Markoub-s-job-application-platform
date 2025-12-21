interface CreateAdminProps {
    onLogin: () => void; // Toggle to get back to login page
}

const CreateFirstAdminForm = ({ onLogin }: CreateAdminProps) => {

    return (
        <section className="flex flex-col items-start w-full gap-10">
            <div className='w-full flex flex-col gap-2'>
                <h1 className='w-full flex items-center justify-center text-6xl font-bold'>
                    Create admin
                </h1>
                <p className='w-full flex items-center justify-center text-gray-400'>
                    *This is not a sign up page it's only to create the first admin
                </p>
            </div>

            <form className="flex flex-col items-start w-full" >
                <label htmlFor="firstName" >First name</label>
                <input type="firstName" id="firstName" name="firstName"
                    placeholder="Hamid"
                    className="w-full border-[#e7e7e7] border rounded-xl p-4 mb-5"
                />
                <label htmlFor="lastName" >Last name</label>
                <input type="lastName" id="lastName" name="lastName"
                    placeholder="Alaoui"
                    className="w-full border-[#e7e7e7] border rounded-xl p-4 mb-5"
                />
                <label htmlFor="lastName" >Email</label>
                <input type="email" id="email" name="email"
                    placeholder="yassine@gmail.com"
                    className="w-full border-[#e7e7e7] border rounded-xl p-4 mb-5"
                />

                <label htmlFor="password">Password</label>
                <input type="password" id="password" name="password"
                    placeholder="SecretPassword123"
                    className="w-full border-[#e7e7e7] border rounded-xl p-4 mb-5"
                />

                <button type="submit"
                    className="w-full p-4 bg-[#ff6804] rounded-xl font-bold text-xl text-white cursor-pointer hover:bg-orange-400"
                >
                    Create
                </button>
            </form>
            <p className="text-sm text-gray-400">
                Already have an account? <span className="text-[#ff6804] cursor-pointer" onClick={onLogin}>Login</span>
            </p>
        </section>
    )
}

export default CreateFirstAdminForm