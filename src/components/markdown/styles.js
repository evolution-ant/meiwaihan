// @mui
import { styled, alpha } from '@mui/material/styles';

// ----------------------------------------------------------------------

const StyledMarkdown = styled('div')(({ theme }) => {
  const isLight = theme.palette.mode === 'light';

  return {
    // Text
    h1: { ...theme.typography.h1 },
    h2: { ...theme.typography.h2 },
    h3: { ...theme.typography.h3 },
    h4: { ...theme.typography.h4 },
    h5: { ...theme.typography.h5 },
    h6: { ...theme.typography.h6 },
    p: { ...theme.typography.body1 },

    br: {
      display: 'grid',
      content: '""',
      marginTop: '0.75em',
    },

    // Divider
    hr: {
      margin: 0,
      flexShrink: 0,
      borderWidth: 0,
      msFlexNegative: 0,
      WebkitFlexShrink: 0,
      borderStyle: 'solid',
      borderBottomWidth: 'thin',
      borderColor: theme.palette.divider,
    },
    // Code
    '& code:not(pre > code)': {
      //   color: 'rgb(173, 165, 155)',
      backgroundColor: 'rgb(54, 41, 0)',
      borderColor: 'rgb(110, 87, 8)',
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },

    a: {
      textDecoration: 'none',
      position: 'relative',
      '&::after': {
        content: '""',
        position: 'absolute',
        height: '1px',
        width: '0',
        bottom: '0',
        left: '0',
        backgroundColor: theme.palette.primary.main, // 链接下划线的颜色
        transition: 'width 0.3s ease-in-out',
      },
      '&:hover::after': {
        width: '100%',
      },
      '&:hover': {
        textDecoration: 'none',
      },
    },

    // List
    '& ul, & ol': {
      margin: 0,
      '& li': {
        lineHeight: 2,
      },
    },

    // Blockquote
    '& blockquote': {
      lineHeight: 1.5,
      fontSize: '1.5em',
      margin: '40px auto',
      position: 'relative',
      fontFamily: 'Georgia, serif',
      padding: theme.spacing(3, 3, 3, 8),
      color: theme.palette.text.secondary,
      borderRadius: theme.shape.borderRadius * 2,
      backgroundColor: theme.palette.background.neutral,
      [theme.breakpoints.up('md')]: {
        width: '95%',
      },
      '& p, & span': {
        marginBottom: 0,
        fontSize: 'inherit',
        fontFamily: 'inherit',
      },
      '&:before': {
        left: 16,
        top: -8,
        display: 'block',
        fontSize: '3em',
        content: '"\\201C"',
        position: 'absolute',
        color: theme.palette.text.disabled,
      },
    },

    // Code Block
    '& pre': {
      fontSize: 16,
      overflowX: 'auto',
      whiteSpace: 'pre',
      padding: theme.spacing(2),
      color: theme.palette.common.white,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: isLight ? theme.palette.grey[900] : alpha(theme.palette.grey[500], 0.16),
    },
    '& pre::before': {
      content: '""',
      display: 'block',
      height: 13,
      background:
        'url(data:image/svg+xml;base64,PHN2ZyBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA1NCAxMyI+CiAgPGNpcmNsZSBjeD0iNi41IiBjeT0iNi41IiByPSI2LjUiIGZpbGw9IiNGMzZCNUMiLz4KICA8Y2lyY2xlIGN4PSIyNi41IiBjeT0iNi41IiByPSI2LjUiIGZpbGw9IiNGOUJFNEQiLz4KICA8Y2lyY2xlIGN4PSI0Ny41IiBjeT0iNi41IiByPSI2LjUiIGZpbGw9IiM1NkM0NTMiLz4KPC9zdmc+Cg==)',
      marginBottom: 8,
      backgroundRepeat: 'no-repeat',
    },
    // '& code': {
    //   fontSize: 14,
    //   borderRadius: 4,
    //   whiteSpace: 'pre',
    //   padding: theme.spacing(0.2, 0.5),
    //   color: theme.palette.warning[isLight ? 'darker' : 'lighter'],
    // //   backgroundColor: theme.palette.warning[isLight ? 'lighter' : 'darker'],
    //   '&.hljs': { padding: 0, backgroundColor: 'transparent' },
    // },

    // Table
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      border: `1px solid ${theme.palette.divider}`,
      'th, td': {
        padding: theme.spacing(1),
        border: `1px solid ${theme.palette.divider}`,
      },
      'tbody tr:nth-of-type(odd)': {
        backgroundColor: theme.palette.background.neutral,
      },
    },

    // Checkbox
    input: {
      '&[type=checkbox]': {
        position: 'relative',
        cursor: 'pointer',
        '&:before': {
          content: '""',
          top: -2,
          left: -2,
          width: 17,
          height: 17,
          borderRadius: 3,
          position: 'absolute',
          backgroundColor: theme.palette.grey[isLight ? 300 : 700],
        },
        '&:checked': {
          '&:before': {
            backgroundColor: theme.palette.primary.main,
          },
          '&:after': {
            content: '""',
            top: 1,
            left: 5,
            width: 4,
            height: 9,
            position: 'absolute',
            transform: 'rotate(45deg)',
            msTransform: 'rotate(45deg)',
            WebkitTransform: 'rotate(45deg)',
            border: `solid ${theme.palette.common.white}`,
            borderWidth: '0 2px 2px 0',
          },
        },
      },
    },
  };
});

export default StyledMarkdown;
