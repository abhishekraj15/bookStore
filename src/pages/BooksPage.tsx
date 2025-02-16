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
import { Skeleton } from "@/components/ui/skeleton";

import { getBooks } from "@/http/api";
import { Book } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { CirclePlus, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";

const BooksPage = () => {
  const { data, isLoading, isError } = useQuery<{ data?: Book[] }>({
    queryKey: ["books"],
    queryFn: getBooks,
    staleTime: 10000,
  });

  if (isError) {
    return (
      <p className="text-red-500">Failed to load books. Please try again.</p>
    );
  }

  // Ensure books is always an array
  const books: Book[] = data?.data ?? [];

  return (
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
                  Image
                </TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Genre</TableHead>
                <TableHead className="hidden md:table-cell">Author</TableHead>
                <TableHead className="hidden md:table-cell">
                  Created At
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="hidden sm:table-cell">
                      <Skeleton className="h-16 w-16 rounded-md" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-12" />
                    </TableCell>
                  </TableRow>
                ))
              ) : books.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No books found.
                  </TableCell>
                </TableRow>
              ) : (
                books.map((book: Book) => (
                  <TableRow key={book._id}>
                    <TableCell className="hidden sm:table-cell">
                      <img
                        alt={book.title || "Book cover"}
                        className="aspect-square rounded-md object-cover"
                        height="64"
                        width="64"
                        src={book.coverImage || "/placeholder.png"}
                      />
                    </TableCell>
                    <TableCell className="font-medium">{book.title}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{book.genre}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {book.author?.name || "Unknown"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(book.createdAt).toLocaleDateString()}
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
            Showing <strong>1-10</strong> of <strong>{books.length}</strong>{" "}
            books
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default BooksPage;
