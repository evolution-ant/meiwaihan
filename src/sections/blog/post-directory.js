import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';

const StyledUl = styled('ul')`
  list-style-type: none;
  margin: 0;
  padding-left: 0;
`;

const StyledLi = styled('li')`
  cursor: pointer;
  margin-left: 0;
  margin-top: 7px;
  padding: 0;
`;

const StyledSpan = styled('span')(
  ({ theme, level, selected }) => `
    display: block;
    border-left: solid 2px transparent;
    padding-left: ${(level - 2) * 20 + 5}px;
    margin-left: 0px;
    &:hover {
        color: ${theme.palette.grey[500]};
        border-left-color: ${theme.palette.grey[500]};
    }
    ${
      selected &&
      `
        color: ${theme.palette.primary.main}!important;
        border-left-color: ${theme.palette.primary.main}!important;
    `
    }
`
);

const DirectoryItem = ({ item, selectedItem, onSelectionChange }) => (
  <StyledLi>
    <StyledSpan
      selected={selectedItem === item.id}
      onClick={() => {
        onSelectionChange(item.id);
        const element = document.getElementById(item.id);
        if (element) {
          element.scrollIntoView();
        }
      }}
      level={item.level}
      id={item.id}
    >
      {item.label}
    </StyledSpan>
  </StyledLi>
);

DirectoryItem.propTypes = {
  item: PropTypes.shape({
    label: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    id: PropTypes.string.isRequired,
  }).isRequired,
  selectedItem: PropTypes.string,
  onSelectionChange: PropTypes.func.isRequired,
};

const DirectoryList = ({ items, selectedItem, onSelectionChange }) => (
  <StyledUl>
    {items.map((item) => (
      <DirectoryItem
        key={item.id}
        item={item}
        selectedItem={selectedItem}
        onSelectionChange={onSelectionChange}
      />
    ))}
  </StyledUl>
);

DirectoryList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedItem: PropTypes.string,
  onSelectionChange: PropTypes.func.isRequired,
};

export default function PostDirectory({ headers, selectedHeader, setSelectedHeader }) {
  const handleSelectedHeaderChange = (id) => {
    setSelectedHeader(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView();
    }
  };

  return (
    <DirectoryList
      items={headers}
      selectedItem={selectedHeader}
      onSelectionChange={handleSelectedHeaderChange}
    />
  );
}

PostDirectory.propTypes = {
  headers: PropTypes.array.isRequired,
  selectedHeader: PropTypes.string,
  setSelectedHeader: PropTypes.func.isRequired,
};
