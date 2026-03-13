/**
 * LINE Messaging API - Push notification
 * Sends result notifications via LINE Official Account
 */

interface LineMessage {
  type: 'text';
  text: string;
}

interface FlexMessage {
  type: 'flex';
  altText: string;
  contents: object;
}

export async function pushMessage(
  to: string,
  messages: (LineMessage | FlexMessage)[]
): Promise<boolean> {
  const token = process.env.LINE_CHANNEL_TOKEN;
  if (!token) {
    console.warn('LINE_CHANNEL_TOKEN not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ to, messages }),
    });

    if (!response.ok) {
      console.error('LINE push failed:', response.status, await response.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('LINE push error:', err);
    return false;
  }
}

export async function broadcastMessage(
  messages: (LineMessage | FlexMessage)[]
): Promise<boolean> {
  const token = process.env.LINE_CHANNEL_TOKEN;
  if (!token) {
    console.warn('LINE_CHANNEL_TOKEN not configured');
    return false;
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/broadcast', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      console.error('LINE broadcast failed:', response.status, await response.text());
      return false;
    }

    return true;
  } catch (err) {
    console.error('LINE broadcast error:', err);
    return false;
  }
}

export function buildResultNotification(
  marketName: string,
  flagEmoji: string,
  winningNumber: string,
  siteName: string,
  winningNumber2d: string | null = null
): FlexMessage {
  const altParts = [`3 ตัวบน: ${winningNumber}`];
  if (winningNumber2d) altParts.push(`2 ตัวล่าง: ${winningNumber2d}`);

  const bodyContents: object[] = [
    {
      type: 'text',
      text: siteName,
      weight: 'bold',
      size: 'sm',
      color: '#888888',
    },
    {
      type: 'text',
      text: `${flagEmoji} ${marketName}`,
      weight: 'bold',
      size: 'lg',
      margin: 'md',
    },
    {
      type: 'text',
      text: '3 ตัวบน',
      size: 'xs',
      color: '#aaaaaa',
      align: 'center',
      margin: 'lg',
    },
    {
      type: 'text',
      text: winningNumber,
      weight: 'bold',
      size: '3xl',
      color: '#D4A829',
      align: 'center',
      margin: 'sm',
    },
  ];

  if (winningNumber2d) {
    bodyContents.push(
      {
        type: 'text',
        text: '2 ตัวล่าง',
        size: 'xs',
        color: '#aaaaaa',
        align: 'center',
        margin: 'md',
      },
      {
        type: 'text',
        text: winningNumber2d,
        weight: 'bold',
        size: 'xxl',
        color: '#D4A829',
        align: 'center',
        margin: 'sm',
      }
    );
  }

  bodyContents.push({
    type: 'text',
    text: new Date().toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' }),
    size: 'xs',
    color: '#aaaaaa',
    margin: 'md',
    align: 'center',
  });

  return {
    type: 'flex',
    altText: `${siteName}: ${marketName} — ${altParts.join(', ')}`,
    contents: {
      type: 'bubble',
      body: {
        type: 'box',
        layout: 'vertical',
        contents: bodyContents,
      },
    },
  };
}
