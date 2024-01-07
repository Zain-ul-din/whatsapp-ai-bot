import { Flex, Grid, GridItem } from '@chakra-ui/react';
import Header from './components/Header';
import Messages from './components/Messages';

export default function App() {
  return (
    <Flex w={'100%'} minH={'100%'} height={'100%'} display={'flex'}>
      <Grid templateColumns={'20% 50% 30%'} w={'100%'} h={'100%'}>
        <GridItem w="100%" h="100%" borderRight={'1px'} borderColor={'gray.200'} boxShadow={'lg'}>
          <Header />
        </GridItem>
        <GridItem w="100%" h="100%" borderRight={'1px'} borderColor={'gray.200'}>
          <Messages />
        </GridItem>
        <GridItem w="100%" h="100%">
          {/* Hey{' '} */}
        </GridItem>
      </Grid>
    </Flex>
  );
}
