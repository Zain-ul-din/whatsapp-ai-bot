import { Box, Flex, Heading, SkeletonText, Spinner } from '@chakra-ui/react';
import QrCode from './QrCode';
import useAuth from '../hooks/useAuth';

const Messages = () => {
  const authState = useAuth();

  if (authState.authState === 'loading') return <QrCode />;
  if (authState.authState === 'loading_chat') return <MessagesSkelton />;

  return <Flex>Use Authenticated</Flex>;
};

const MessagesSkelton = () => {
  return (
    <Flex w={'100%'} h={'100%'}>
      <Box padding="6" boxShadow="lg" w={'full'}>
        <Heading size={'lg'}>
          <Spinner mr={3} />
          Loading Chat...
        </Heading>
        <SkeletonText
          mt="8"
          noOfLines={10}
          spacing="8"
          skeletonHeight="4"
          startColor="gray.200"
          endColor="gray.300"
        />
      </Box>
    </Flex>
  );
};

export default Messages;
