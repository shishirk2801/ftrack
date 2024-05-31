const Navbar = () => {
  return (
    <nav className="bg-white dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-2 p-4">
        <a href="" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">FTrack</span>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
