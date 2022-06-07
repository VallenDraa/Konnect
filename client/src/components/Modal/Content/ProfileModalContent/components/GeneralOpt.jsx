import { IoInvertModeSharp, IoSparklesSharp } from 'react-icons/io5';
import { BsFillSunFill, BsFillMoonFill } from 'react-icons/bs';
import SwitchBtn from '../../../../Buttons/SwitchBtn';

const GeneralOpt = () => {
  return (
    <main>
      <div>
        <h2 className="font-semibold flex items-center gap-2 text-gray-500 text-xs mb-2">
          <IoSparklesSharp />
          Appearance
        </h2>
        <ul className=" w-full overflow-y-hidden flex flex-col divide-y-2">
          {/* theme */}
          <li className="flex items-center justify-between w-full hover:bg-gray-100 p-3 duration-200">
            <span className="flex items-center gap-2 font-semibold text-sm">
              <IoInvertModeSharp />
              Theme
            </span>
            <SwitchBtn
              onClick={(isActive) => console.log(isActive)}
              icon1={<BsFillSunFill className="text-sm" />}
              icon2={<BsFillMoonFill className="text-sm" />}
            />
          </li>
        </ul>
      </div>
    </main>
  );
};

export default GeneralOpt;
