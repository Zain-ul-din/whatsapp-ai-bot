import { Flex, Skeleton, Text } from '@chakra-ui/react';
import QRCode from 'react-qr-code';
import useAuth from '../hooks/useAuth';

const QrCode = () => {
  const authState = useAuth();

  return (
    <Flex
      w={'100%'}
      h={'100%'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDir={'column'}
      gap={4}
    >
      <Flex
        p={2}
        border={'1px'}
        borderColor={'gray.200'}
        position={'relative'}
        rounded={'md'}
        bg={'white'}
      >
        <QRCode value={authState.qrCode} />
        {/* overlay */}
        <Flex position={'absolute'} left={0} top={0} w={'100%'} h={'100%'}>
          <Skeleton w={'100%'} h={'100%'} isLoaded={authState.qrCode.length !== 0}></Skeleton>
        </Flex>
      </Flex>
      {authState.qrCode.length === 0 ? (
        <Text>Please Wait, Generating QR Code...</Text>
      ) : (
        <Text>Use Your Phone to Scan QR Code</Text>
      )}
    </Flex>
  );
};

export default QrCode;
