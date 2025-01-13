'use client';
import {HashLoader} from 'react-spinners';

const Spinner = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <HashLoader color="#65AFFF" size={50} />
    </div>
  );
};
export default Spinner;     