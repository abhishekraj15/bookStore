import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup } from "@/http/api";
import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      console.log("SignUp Success");
      navigate("/dashboard/home");
    },
  });

  const handleSignupSubmit = (e: any) => {
    e.preventDefault();
    const name = emailRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    console.log("Data is :", { name, email, password });

    //server api call
    if (!name || !email || !password) {
      return alert("Please enter name , email and password");
    }
    mutation.mutate({ name, email, password });
  };
  return (
    <>
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Sign Up</CardTitle>
              <CardDescription>
                <p>Enter your information to create an account</p>
                {mutation.isError && (
                  <>
                    <span className="text-red-500 text-sm">
                      {mutation.error.message}
                    </span>
                  </>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    ref={nameRef}
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Enter name"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    ref={emailRef}
                    name="email"
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    ref={passwordRef}
                    name="password"
                    id="password"
                    type="password"
                  />
                </div>
                <Button
                  onClick={handleSignupSubmit}
                  type="submit"
                  className="w-full"
                >
                  {mutation.isPending && (
                    <>
                      <LoaderCircle className="animate-spin" />
                    </>
                  )}
                  <span>Create an account</span>
                </Button>
              </div>
              <div className="mt-4 text-center text-sm">
                Already have an account?{" "}
                <Link to={"/auth/login"} className="underline">
                  Sign in
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default RegisterPage;
