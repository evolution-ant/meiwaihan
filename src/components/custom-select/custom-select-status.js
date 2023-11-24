// @mui
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
// components
import Iconify from 'src/components/iconify';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Label from 'src/components/label';

// ----------------------------------------------------------------------

export default function CustomSelectStatus({ select, onSelect }) {
  const popover = usePopover();

  const selectOptions = ['', 'hard', 'normal', 'easy'];
  const selectedOption = selectOptions.find((option) => option === select);

  const renderIcon = () => {
    if (selectedOption === 'hard') {
      return (
        <Label variant="filled" color="error">
          {selectedOption}
        </Label>
      );
    }
    if (selectedOption === 'normal') {
      return (
        <Label variant="filled" color="warning">
          {selectedOption}
        </Label>
      );
    }
    if (selectedOption === 'easy') {
      return (
        <Label variant="filled" color="success">
          {selectedOption}
        </Label>
      );
    }
    return "All";
  };

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
            key={option}
            selected={select === option}
            disabled={select === option}
            onClick={() => {
              popover.onClose();
              onSelect(option);
            }}
          >
            {option?<>{option}</>:"all"}
          </MenuItem>
        ))}
      </CustomPopover>
    </>
  );
}

CustomSelectStatus.propTypes = {
  onSelect: PropTypes.func,
  select: PropTypes.string,
};
