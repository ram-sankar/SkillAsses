import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import "./styles/TableComponent.scss";

interface DataItem {
  [key: string]: any;
}

interface Column {
  title: string;
  field: any;
}

interface TableComponentProps<T extends DataItem> {
  data: T[];
  columns: Column[];
  title: string;
  subtitle?: string;
  baseUrl?: string;
  buttonText?: string;
  navigateTo?: string;
  renderActions?: (item: T) => React.ReactNode;
  showActions?: boolean;
}

const TableComponent: React.FC<TableComponentProps<any>> = ({ data, columns, title, subtitle, baseUrl, buttonText, navigateTo, renderActions, showActions }) => {
  const navigate = useNavigate();

  const renderTableCell = (item: any, column: Column) => {
    if (column.title === "Status") {
      const cellValue = item[column.field];
      return <span className={`status-badge ${cellValue.toLowerCase().replace(" ", "-")}`}>{cellValue}</span>;
    } else {
      return item[column.field];
    }
  };

  const handleViewClick = (id: any) => {
    navigate(`${baseUrl}/${id}`);
  };

  const handleTopRightButtonClick = () => {
    if (navigateTo) {
      navigate(navigateTo);
    }
  };

  return (
    <Box mt={4} className="genericTable">
      <Box position="relative" textAlign="center" mb={2}>
        <Typography variant="h5">{title}</Typography>
        {subtitle && <Typography variant="subtitle1">{subtitle}</Typography>}
        {buttonText && navigateTo && (
          <Box position="absolute" top={0} right={0}>
            <Button onClick={handleTopRightButtonClick}>{buttonText}</Button>
          </Box>
        )}
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.title} align="center">
                  <Box display="flex" justifyContent="center">
                    {column.title}
                  </Box>
                </TableCell>
              ))}
              {showActions !== false && (
                <TableCell align="center">
                  <Box display="flex" justifyContent="center">
                    Actions
                  </Box>
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, itemIndex) => (
              <TableRow key={`${item.id}-${itemIndex}`}>
                {columns.map((column, columnIndex) => (
                  <TableCell key={`${itemIndex}-${columnIndex}`} align="center">
                    {renderTableCell(item, column)}
                  </TableCell>
                ))}
                {showActions !== false && (
                  <TableCell align="center">
                    <Box display="flex" gap={1}>
                      <Button outline onClick={() => handleViewClick(item?.id)}>
                        View
                      </Button>
                      {renderActions && renderActions(item)}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TableComponent;
