const getCookie = (name: string): string | null | undefined => {
  if (typeof document === 'undefined') return null;

  const safeName = name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1');

  const regex = new RegExp('(?:^|; )' + safeName + '=([^;]*)');
  const match = document.cookie.match(regex);
  console.log(match);
  console.log(document.cookie);

  return match ? decodeURIComponent(match[1]) : null;
};

export { getCookie };
