import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  EllipsisVerticalIcon,
  DocumentIcon,
} from "@heroicons/react/24/outline";

interface ModalProps {
  open: boolean;
  onClose: (initials: string) => void;
}

interface TopicProps {
  title: string;
  description: string;
  initials: string;
  pick: (initials: string) => void;
}

function Topic(props: TopicProps) {
  return (
    <li
      className="col-span-1 flex rounded-md shadow-sm cursor-pointer"
      onClick={() => props.pick(props.initials)}
    >
      <div
        className={
          "flex w-16 flex-shrink-0 items-center justify-center rounded-l-md text-sm font-medium text-white bg-gray-700"
        }
      >
        {props.initials}
      </div>
      <div className="flex flex-1 items-center justify-between rounded-r-md border-b border-r border-t border-gray-200 bg-white">
        <div className="flex-1 px-4 py-2 text-sm">
          <a
            href={"#"}
            className="font-medium text-gray-900 hover:text-gray-600"
          >
            {props.title}
          </a>
          <p className="text-gray-500 text-xs">{props.description}</p>
        </div>
      </div>
    </li>
  );
}

export default function Modal(props: ModalProps) {
  const pickTopic = (initials: string) => {
    props.onClose(initials);
  };
  return (
    <Transition.Root show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => null}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-[#1B1E28] px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
                <div>
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-900">
                    <DocumentIcon
                      className="h-6 w-6 text-[#fab387]"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="mt-3 text-center sm:mt-5 sm:mb-5">
                    <Dialog.Title
                      as="h3"
                      className="text-base font-semibold leading-6 text-gray-100"
                    >
                      Choose a topic from the list
                    </Dialog.Title>
                  </div>
                  <ul className="space-y-4">
                    <Topic
                      initials="DB"
                      description="Ask about benefits of working at devbase, PTOs, overtime, personal development budget, etc."
                      title="Devbase Benefits"
                      pick={pickTopic}
                    />
                    <Topic
                      initials="38BRC"
                      description="Ask technical specifications about 38BRC 12 SEER Air Conditioner, including accessories, dimensions, electrical data, etc."
                      title="38BRC 12 SEER Air Conditioner"
                      pick={pickTopic}
                    />
                  </ul>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
