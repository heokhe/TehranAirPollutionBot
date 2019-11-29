const getWordAndEmoji = index => {
  if (index <= 50) return ['پاک', '🍃'];
  if (index <= 100) return ['سالم', '👍'];
  if (index <= 150) return ['برای گروه‌های حساس ناسالم', '⚠'];
  if (index <= 200) return ['ناسالم', '⛔️'];
  return ['بسیار ناسالم و خطرناک', '😐'];
};

const FA_DIGITS = [...'۰۱۲۳۴۵۶۷۸۹'];
const numberToFarsi = n => n.toString()
  .replace(/\d/g, i => FA_DIGITS[i]);

export const writeMessage = ({ now, last24hours }) => {
  const [word, emoji] = getWordAndEmoji(now);
  return `
*${emoji} هوای تهران هم‌اکنون ${word} است!*

هم‌اکنون: *${numberToFarsi(now)}*
۲۴ ساعت گذشته: *${numberToFarsi(last24hours)}*
  `;
};
