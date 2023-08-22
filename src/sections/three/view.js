'use client';

import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top


// const top100Films = [
//     { id: 1, title: 'The Shawshank Redemption' },
//     { id: 2, title: 'The Godfather' },
//     { id: 3, title: 'The Godfather: Part II' },
//     // ...rest of your movies...
//   ];
export default function CheckboxesTags() {
    const top100Films = React.useMemo(() => [
        { id: 1, title: 'The Shawshank Redemption' },
        { id: 2, title: 'The Godfather' },
        { id: 3, title: 'The Godfather: Part II' },
        // ...rest of your movies...
    ], []);
    const [selectedIds, setSelectedIds] = React.useState([1, 2]);

    // 查找选中的id
    const [selectedValue, setSelectedValue] = React.useState(
      top100Films.filter(film => selectedIds.includes(film.id))
    );
    
  return (
    <Autocomplete
      multiple
      //   id="checkboxes-tags-demo"
      options={top100Films}
      disableCloseOnSelect
      getOptionLabel={(option) => option.title}
      renderOption={(props, option, { selected }) => <li {...props}>{option.title}</li>}
      renderTags={(value, getTagProps) =>
        value.map((option, index) => (
          <Chip
            {...getTagProps({ index })}
            size="small"
            variant="soft"
            label={option.title}
            key={option.id}
          />
        ))
      }
      onChange={(event, values) => {
        setSelectedIds(values.map((value) => value.id));
        setSelectedValue(values);
        console.log(values.map((value) => value.id)); // You can see selected IDs in console
      }}
      value={selectedValue}
      style={{ width: 500 }}
      renderInput={(params) => <TextField {...params} placeholder="Favorites" />}
    />
  );
}

