import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { createBook } from "@/http/api";
import { LoaderCircle } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  genre: z.string().min(2, {
    message: "Genre must be a least 2 charcter.",
  }),
  description: z.string().min(10, {
    message: "Description must be a least 10 charcter.",
  }),
  coverImage: z.instanceof(FileList).refine((file) => {
    return file.length === 1;
  }, "Cover Image is required"),

  file: z.instanceof(FileList).refine((file) => {
    return file.length === 1;
  }, "Book PDF  is required"),
});

const CreateBook = () => {
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      genre: "",
      description: "",
    },
  });

  const coverImageRef = form.register("coverImage");
  const fileRef = form.register("file");

  const queryClient = new QueryClient();

  const mutation = useMutation({
    mutationFn: createBook,
    onSuccess: (response: any) => {
      queryClient.invalidateQueries({ queryKey: "books" });
      console.log("Book create success", response);
      navigate("/dashboard/books");
      form.reset();
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("genre", values.genre);
    formData.append("description", values.description);
    formData.append("coverImage", values.coverImage[0]);
    formData.append("file", values.file[0]);
    mutation.mutate(formData);
    // console.log(values);
  }

  return (
    <>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <Link to={"/dashboard/home"}>Home</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <Link to={"/dashboard/books"}>Books</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />

                  <BreadcrumbItem>
                    <BreadcrumbPage>Create</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              <div className="flex items-center justify-center gap-4">
                <Link to="/dashboard/books">
                  <Button variant="outline" size="sm">
                    <span> Cancel</span>
                  </Button>
                </Link>
                <Button
                  disabled={mutation?.isPending}
                  type="submit"
                  size="sm"
                  className="flex items-center justify-center gap-2"
                >
                  {mutation.isPending && (
                    <>
                      <LoaderCircle className="animate-spin" />
                    </>
                  )}
                  <span>Submit</span>
                </Button>
              </div>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Create a new Book</CardTitle>
                <CardDescription>
                  Fill out the form below to create a new book.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="grid gap-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Book Title</FormLabel>
                        <FormControl>
                          <Input type="text" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="genre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Genre</FormLabel>
                        <FormControl>
                          <Input type="text" className="w-full" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea className="w-full min-h-32" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coverImage"
                    render={() => (
                      <FormItem>
                        <FormLabel>Cover Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            // required
                            className="w-full "
                            {...coverImageRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="file"
                    render={() => (
                      <FormItem>
                        <FormLabel>Book PDF</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            // accept="application/pdf,.csv"
                            // required
                            className="w-full "
                            {...fileRef}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </>
  );
};

export default CreateBook;
