// @mui
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export default function CustomSelectFav({ title, select, onSelect }) {
  const popover = usePopover();

  const selectOptions = [
    { value: null, label: 'All Fav' },
    { value: true, label: 'Fav' },
    { value: false, label: 'UnFav' },
  ];

  const selectedOption = selectOptions.find((option) => option.value === select);

  const renderIcon = () => {
    if (selectedOption.label === 'All Fav') {
      return selectedOption.label;
    }
    if (selectedOption.label === 'Fav') {
      return <Iconify icon="eva:star-fill" sx={{ color: "#FFAB00" }} />;
    }
    return <Iconify icon="eva:star-outline" />
  }

  return (
    <>
      <Button
        disableRipple
        color="inherit"
        onClick={popover.onOpen}
        endIcon={
          <Iconify
            icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
          />
        }
        sx={{ fontWeight: 'fontWeightSemiBold', textTransform: 'capitalize' }}
      >
        {renderIcon()}
      </Button>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 140 }}>
        {selectOptions.map((option) => (
          <MenuItem
            key={option.value}
            selected={select === option.value}
            disabled={select === option.value}
            onClick={() => {
              popover.onClose();
              onSelect(option.value);
              console.log(option.value);
            }}
          >
            {option.label}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

CustomSelectFav.propTypes = {
  title: PropTypes.string,
  onSelect: PropTypes.func,
  select: PropTypes.string,
};
