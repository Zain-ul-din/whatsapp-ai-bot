// import { useEffect, useState } from 'react';
// import socket from './lib/socket';

export default function App() {
  // const [connected, setConnected] = useState<boolean>(false);
  // const [qrCode, setQrCode] = useState<string>('');

  // useEffect(() => {
  //   socket.on('connect', () => {
  //     setConnected(true);
  //   });

  //   socket.on('qr_code', ({ qrCode }: { qrCode: string }) => {
  //     setQrCode(qrCode);
  //   });

  //   return () => {
  //     socket.off('connect');
  //   };
  // }, []);

  // return (
  //   <div>
  //     {connected ? (
  //       <>Connected ✔{qrCode && <>Got QR Code from server {qrCode}</>}</>
  //     ) : (
  //       <>Not Connected ❌</>
  //     )}
  //   </div>
  // );

  return <></>;
}
