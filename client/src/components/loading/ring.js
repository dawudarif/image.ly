import { ring } from 'ldrs';

ring.register();

const Ring = ({ size, color }) => {
  return (
    <l-ring
      size={size}
      stroke='5'
      bg-opacity='0'
      speed='2'
      color={color ? color : 'white'}
    ></l-ring>
  );
};

export default Ring;
