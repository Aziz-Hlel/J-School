interface ISeed<TArgs = void, T = void> {
  run(args: TArgs): Promise<T>;
}

export default ISeed;
