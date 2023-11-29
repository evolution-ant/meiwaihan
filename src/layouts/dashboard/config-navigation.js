import { useEffect, useState } from 'react';
// routes
// components
import SvgColor from 'src/components/svg-color';
// axios
import axios from 'src/utils/axios';

import { setSession } from 'src/auth/context/jwt/utils';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  post: icon('ic_blog'),
  blog: icon('ic_blog'),
  joke: icon('ic_chat'),
  code: icon('ic_code'),
  idea: icon('ic_chat'),
  diary:icon('ic_analytics'),
  image: icon('ic_image'),
  chart: icon('ic_chart'),
  mind: icon('ic_mind'),
  'post-one': icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  word: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

function transformData(originalData) {
  const result = originalData.attributes.items.data
    .sort((a, b) => a.attributes.order - b.attributes.order)
    .map((item) => ({
      ...transformItem(item, true),
    }));
  return result;
}

function transformItem(item, isRoot = false) {
  const res = {};
  if (item.attributes.url === null || item.attributes.url === '') {
    res.subheader = item.attributes.title;
  } else {
    res.title = item.attributes.title;
    res.path = item.attributes.url;
    res.icon = ICONS[item.attributes.title.toLowerCase()];
  }
  if (item.attributes.children.data.length > 0) {
    const childrenItems = item.attributes.children.data
      .sort((a, b) => a.attributes.order - b.attributes.order)
      .map((subItem) => ({
        ...transformItem(subItem),
      }));
    if (isRoot) {
      res.items = childrenItems;
    } else {
      res.children = childrenItems;
    }
  }

  return res;
}

export function useNavData() {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      const accessToken = localStorage.getItem('accessToken');
      setSession(accessToken);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_HOST_API}/menus?filters[title][$eq]=Admin&nested&populate=*`);
      const responseData = response.data.data[0];
      const transformedData = transformData(responseData);
      setData(transformedData);
    };
    fetchData();
  }, []);

  return data;
}
