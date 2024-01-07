import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Link,
  Menu,
  MenuButton,
  MenuItem,
  MenuList
} from '@chakra-ui/react';
import { FaKey, FaGithub } from 'react-icons/fa';
import { APIKeysSites } from '../lib/constant';

const Header = () => {
  return (
    <Flex w={'100%'} h={'100%'} flexDir={'column'}>
      <Box p={4}>
        <Heading size={'md'}>WhatsApp Bot</Heading>
      </Box>
      <Divider></Divider>

      {/* navigation */}
      <Flex w={'100%'} flexDir={'column'} p={4} mt={'auto'} as={'nav'}>
        <Menu matchWidth>
          <MenuButton w={'100%'}>
            <Button w={'100%'}>Get API Keys</Button>
          </MenuButton>
          <MenuList>
            {APIKeysSites.map(({ name, url }, idx) => {
              return (
                <a key={idx} href={url} target="_blank">
                  <MenuItem icon={<FaKey />}>{name}</MenuItem>
                </a>
              );
            })}
          </MenuList>
        </Menu>
      </Flex>

      <Divider></Divider>
      {/* footer */}
      <Flex p={4} gap={1} flexWrap={'wrap'}>
        <a
          aria-label="github"
          href="https://github.com/Zain-ul-din/whatsapp-ai-bot"
          target="_blank"
        >
          <Box display={'inline-block'} px={2} fontSize={'x-large'} cursor={'pointer'}>
            <FaGithub />
          </Box>
        </a>
        <Link
          href="https://github.com/Zain-ul-din/whatsapp-ai-bot/issues/new"
          target="_blank"
          style={{
            textWrap: 'nowrap'
          }}
        >
          Report Issue here
        </Link>
      </Flex>
    </Flex>
  );
};

export default Header;
