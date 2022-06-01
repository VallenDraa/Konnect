import { Link } from 'react-router-dom';
import patternBgLight from '../../svg/authPage/patternBgLight.svg';
import { RiLoginCircleLine } from 'react-icons/ri';
import { Logo } from '../../components/Logo/Logo';
import { Input } from '../../components/Input/Input';
import { useRef } from 'react';

export const Login = () => {
  const username = useRef();
  const password = useRef();
  const rememberMe = useRef();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formValue = {
      username: username.current.value,
      password: password.current.value,
      rememberMe: rememberMe.current.checked,
    };

    console.log(formValue);
  };
  return (
    <main className="flex h-screen w-full">
      <section
        className="basis-full md:basis-2/3 min-h-screen shadow-inner blur-2xl md:blur-none"
        style={{
          backgroundImage: `url(${patternBgLight})`,
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      ></section>
      <section className="md:basis-1/3 md:min-w-[400px] min-h-screen md:bg-slate-50 shadow-xl absolute md:static inset-x-0 flex flex-col">
        <div className="px-5 py-10 space-y-10 h-full flex flex-col grow">
          <header className="space-y-3 md:space-y-5">
            <div className="absolute top-0 h-16 inset-x-0 p-2 z-20">
              <Logo />
            </div>
            <RiLoginCircleLine className="text-blue-600 text-2xl" />
            <h1 className="font-bold text-3xl">Login</h1>
            <span className="text-gray-500 text-xxs md:text-xs">
              Login to start
              <span className="font-medium text-pink-600"> chatting </span>
              and
              <span className="font-medium text-blue-600"> Konnecting !</span>
            </span>
          </header>
          <form
            onSubmit={(e) => handleSubmit(e)}
            className="space-y-12 md:space-y-16"
          >
            <div className="space-y-8 md:space-y-10">
              <div className="space-y-5">
                <Input label="Username" innerRef={username} />
                <Input label="Password" innerRef={password} />
              </div>
              <div className="text-xxs md:text-xs flex justify-between text-gray-500">
                <div className="flex items-center gap-1">
                  <input
                    id="remember"
                    type="checkbox"
                    className="accent-pink-400 cursor-pointer"
                    ref={rememberMe}
                  />
                  <label htmlFor="remember" className="cursor-pointer">
                    Remember Me
                  </label>
                </div>
                <Link
                  to="/login"
                  className="text-pink-400 underline underline-offset-4"
                >
                  Forgot Password
                </Link>
              </div>
            </div>

            {/* login button */}
            <div className="w-full flex flex-col items-center gap-3">
              <button className="w-full py-2 text-sm md:text-base max-w-xs mx-auto rounded-full duration-200 bg-blue-400 hover:bg-blue-500 focus:bg-blue-600 shadow focus:shadow-inner shadow-blue-500 font-semibold text-white">
                Login
              </button>
              <span className="text-gray-500 text-xxs md:text-xs">
                Not Registered ? click here to{' '}
                <Link
                  to="/register"
                  className="text-pink-400 underline underline-offset-4"
                >
                  Register
                </Link>
              </span>
            </div>
          </form>
          <footer className="grow flex items-end justify-center">
            <span className="text-xxs text-gray-400">
              Copyright &copy; 2022 | Konnect
            </span>
          </footer>
        </div>
      </section>
    </main>
  );
};