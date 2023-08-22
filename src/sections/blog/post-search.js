import PropTypes from 'prop-types';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
// @mui
import Link from '@mui/material/Link';
import Avatar from '@mui/material/Avatar';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';

// components
import Iconify from 'src/components/iconify';
import { useRouter } from 'src/routes/hook';
import SearchNotFound from 'src/components/search-not-found';

// ----------------------------------------------------------------------

export default function PostSearch({ search, onSearch, hrefItem }) {
  const router = useRouter();

  const handleClick = (title) => {
    router.push(hrefItem(title));
  };

  const handleKeyUp = (event) => {
    if (search.query) {
      if (event.key === 'Enter') {
        handleClick(search.query);
      }
    }
  };

  return (
    <Autocomplete
      sx={{ width: { xs: 1, sm: 260 } }}
      autoHighlight
      popupIcon={null}
      options={search.results}
      onInputChange={(event, newValue) => {
        onSearch(newValue)
      }}
      getOptionLabel={(option) => option.attributes.title}
      noOptionsText={<SearchNotFound query={search.query} sx={{ bgcolor: 'unset' }} />}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            minWidth: 320,
          },
        },
        paper: {
          sx: {
            [` .${autocompleteClasses.option}`]: {
              pl: 0.75,
            },
          },
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search..."
          onKeyUp={handleKeyUp}
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ ml: 1, color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
        />
      )}
      renderOption={(props, post, { inputValue }) => {
        const matches = match(post.attributes.title, inputValue);
        const parts = parse(post.attributes.title, matches);
        return (
          <li {...props} key={post.id}>
            <Avatar
              key={post.id}
              alt={post.attributes.title}
              src={`${process.env.NEXT_PUBLIC_STRAPI}${post?.attributes?.thumb?.data?.attributes?.url}`}
              variant="rounded"
              sx={{ width: 48, height: 48, flexShrink: 0, mr: 1.5, borderRadius: 1 }}
            />

            <Link key={inputValue} underline="none" onClick={() => handleClick(post.id)}>
              {parts.map((part, index) => (
                <Typography
                  key={index}
                  component="span"
                  color={part.highlight ? 'primary' : 'textPrimary'}
                  sx={{
                    typography: 'body2',
                    fontWeight: part.highlight ? 'fontWeightSemiBold' : 'fontWeightMedium',
                  }}
                >
                  {part.text}
                </Typography>
              ))}
            </Link>
          </li>
        );
      }}
    />
  );
}

PostSearch.propTypes = {
  hrefItem: PropTypes.func,
  onSearch: PropTypes.func,
  search: PropTypes.object,
};
