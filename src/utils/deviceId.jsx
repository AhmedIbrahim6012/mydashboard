// export function getDeviceId() {
//   let id = localStorage.getItem('device_id');
//   if (!id) {
//     id = crypto.randomUUID();
//     localStorage.setItem('device_id', id);

//      localStorage.removeItem('fcm_token');
//   }
//   return id;
// }

// utils/deviceId.js

export function getDeviceId() {
  let id = localStorage.getItem('device_id');
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem('device_id', id);
    localStorage.removeItem('fcm_token');
  }
  return id;
}

// export function getDeviceName() {
//   const ua = navigator.userAgent;

//   // OS Detection
//   let os = 'Web';
//   if (/Windows NT 10/.test(ua))       os = 'Windows 10';
//   else if (/Windows NT 11/.test(ua))  os = 'Windows 11';
//   else if (/Windows/.test(ua))        os = 'Windows';
//   else if (/Mac OS X/.test(ua))       os = 'macOS';
//   else if (/iPhone/.test(ua))         os = 'iPhone';
//   else if (/iPad/.test(ua))           os = 'iPad';
//   else if (/Android/.test(ua))        os = 'Android';
//   else if (/Linux/.test(ua))          os = 'Linux';

//   // Browser Detection
//   let browser = 'Browser';
//   if (/Edg\//.test(ua))              browser = 'Edge';
//   else if (/OPR\//.test(ua))         browser = 'Opera';
//   else if (/Chrome\//.test(ua))      browser = 'Chrome';
//   else if (/Firefox\//.test(ua))     browser = 'Firefox';
//   else if (/Safari\//.test(ua))      browser = 'Safari';

//   return `${browser} on ${os}`; // → "Chrome on Windows 10"
// }

export async function getDeviceName() {
  const ua = navigator.userAgent;

  // ========== Browser Detection ==========
  let browser = 'Browser';

  // Brave — عنده API خاص
  if (navigator.brave && await navigator.brave.isBrave()) {
    browser = 'Brave';
  }
  else if (/Edg\//.test(ua))     browser = 'Edge';
  else if (/OPR\//.test(ua))     browser = 'Opera';
  else if (/Firefox\//.test(ua)) browser = 'Firefox';
  else if (/Chrome\//.test(ua))  browser = 'Chrome';
  else if (/Safari\//.test(ua))  browser = 'Safari';

  // ========== OS Detection ==========
  let os = 'Web';

  // Windows 11 — userAgentData بيعطي platformVersion الحقيقية
  if (/Windows/.test(ua)) {
    try {
      const uaData = await navigator.userAgentData?.getHighEntropyValues(['platformVersion']);
      if (uaData?.platformVersion) {
        const majorVersion = parseInt(uaData.platformVersion.split('.')[0]);
        os = majorVersion >= 13 ? 'Windows 11' : 'Windows 10';
      } else {
        os = 'Windows';
      }
    } catch {
      os = 'Windows';
    }
  }
  else if (/Mac OS X/.test(ua)) os = 'macOS';
  else if (/iPhone/.test(ua))   os = 'iPhone';
  else if (/iPad/.test(ua))     os = 'iPad';
  else if (/Android/.test(ua))  os = 'Android';
  else if (/Linux/.test(ua))    os = 'Linux';

  return `${browser} on ${os}`;
}