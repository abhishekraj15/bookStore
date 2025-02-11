import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getBooks } from "@/http/api";
import { Book } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus, MoreHorizontal, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
// import { useState } from "react";

const BooksPage = () => {
  // const [bookData, setBookData] = useState([]);
  const { data, isLoading, isError } = useQuery({
    queryKey: ["books"],
    queryFn: getBooks,
    staleTime: 10000, // in mili seconds
  });
  console.log("🚀 ~ BooksPage ~ data:", data);
  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink>
                  <Link to="/dashboard/home">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />

              <BreadcrumbItem>
                <BreadcrumbPage>Books</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Link
            to="/dashboard/books/create"
            className="flex items-center justify-center"
          >
            <Button size="sm">
              <CirclePlus size={20} />
              <span>ADD Book</span>
            </Button>
          </Link>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Books</CardTitle>
            <CardDescription>
              Manage your books and view their sales performance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="hidden w-[100px] sm:table-cell">
                    <span className="">Image</span>
                  </TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Genre</TableHead>

                  <TableHead className="hidden md:table-cell">
                    Author name
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Created at
                  </TableHead>
                  <TableHead>
                    <span className="">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    <p>Loading...</p>
                  </>
                ) : data?.data?.length === 0 ? (
                  <>
                    <p>No data Found</p>
                  </>
                ) : (
                  data?.data?.map((book: Book) => (
                    <TableRow key={book._id}>
                      <TableCell className="hidden sm:table-cell">
                        <img
                          alt="Product image"
                          className="aspect-square rounded-md object-cover"
                          height="64"
                          src={book.coverImage}
                          width="64"
                        />
                      </TableCell>
                      <TableCell className="font-medium">
                        {book.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{book.genre}</Badge>
                      </TableCell>

                      <TableCell className="hidden md:table-cell">
                        {book.author.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {book.createdAt}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              aria-haspopup="true"
                              size="icon"
                              variant="ghost"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Toggle menu</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Edit</DropdownMenuItem>
                            <DropdownMenuItem>Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter>
            <div className="text-xs text-muted-foreground">
              Showing <strong>1-10</strong> of <strong>32</strong> products
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default BooksPage;
