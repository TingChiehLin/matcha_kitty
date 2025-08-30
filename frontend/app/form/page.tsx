"use client";
import React, { useState } from "react";

function Form() {
  const [people, setPeople] = useState<
    {
      name: string;
      dob: string;
      organization: string;
      activity: string;
      description: string;
    }[]
  >([]);
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [organization, setOrganization] = useState("");
  const [activity, setActivity] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && dob && organization) {
      setPeople([
        ...people,
        { name, dob, organization, activity, description },
      ]);
      setName("");
      setDob("");
      setOrganization("");
      setActivity("");
      setDescription("");
    }
  };

  return (
    <>
      <div className="sticky top-0 z-3 bg-white/90 backdrop-blur border-b text-black">
        <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="text-black-2xl font-extrabold ">
              CommunityConnector
            </div>
            <div className="hidden md:block text-sm opacity-80">
              Become a Connector
            </div>
          </div>
          <div className="flex items-center gap-2"></div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6">
          <ol className="flex items-center justify-between gap-2"></ol>
        </div>

        <div className="Signup form max-w-md mx-auto mt-10 p-5 bg-gray-100 rounded-lg shadow-lg text-black outline outline-black outline-2">
          <h2 className="text-2xl font-bold text-center mt-5">
            Register as a Connector
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3 mt-5">
            <label>
              Full Name:
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="p-2 rounded border w-full"
                required
              />
            </label>

            <label>
              Date of Birth:
              <input
                type="text"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="p-2 rounded border w-full"
                required
              />
            </label>

            <label>
              Organization:
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="p-2 rounded border w-full"
                required
              />
            </label>

            <label>
              Connector Activity:
              <input
                type="text"
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="p-2 rounded border w-full"
                required
              />
            </label>

            <input
              type="text"
              placeholder="Description of Activity"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="p-2 rounded border w-full"
              required
            />

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white rounded p-2 font-bold"
            >
              Submit
            </button>
          </form>

          <ul className="mt-5">
            {people.map((person, index) => (
              <li key={index} className="bg-black shadow-md rounded-lg p-4 m-2">
                <div>
                  <strong>Name:</strong> {person.name}
                </div>
                <div>
                  <strong>DOB:</strong> {person.dob}
                </div>
                <div>
                  <strong>Organization:</strong> {person.organization}
                </div>
                <div>
                  <strong>Activity:</strong> {person.activity}
                </div>
                <div>
                  <strong>Description:</strong> {person.description}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Form;
